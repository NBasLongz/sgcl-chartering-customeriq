import { NextRequest, NextResponse } from 'next/server';
import { RawLead, EvaluatedLead } from '@/lib/types/lead';
import { ScoringRules } from '@/lib/types/rules';
import { DEFAULT_RULES } from '@/lib/data/default-rules';
import { evaluateLead } from '@/lib/engine/scoring';
import { sanitizeSensitiveText } from '@/lib/engine/data-masking';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawLeads: RawLead[] = body.leads || [];
    const rules: ScoringRules = body.rules || DEFAULT_RULES;
    const useGemini = Boolean(body.useGemini && process.env.GEMINI_API_KEY);

    if (!Array.isArray(rawLeads) || rawLeads.length === 0) {
      return NextResponse.json(
        { error: 'Danh sách hồ sơ không hợp lệ hoặc đang trống.' },
        { status: 400 }
      );
    }

    // Module 1: Anonymize data if dataMasking is active (Section 3.5.2)
    const sanitizedLeads = rawLeads.map(l => ({
      ...l,
      company: sanitizeSensitiveText(l.company, rules.dataMasking),
      cargo: sanitizeSensitiveText(l.cargo, rules.dataMasking)
    }));

    // If Gemini API is configured and requested:
    if (useGemini && process.env.GEMINI_API_KEY) {
      try {
        const geminiApiKey = process.env.GEMINI_API_KEY;
        const prompt = `Bạn là Chuyên gia Cao cấp về Môi giới Tàu biển (Senior Chartering Broker) của Công ty SGCL (Saigon Cuulong JSC).
Nhiệm vụ: Đánh giá danh sách khách hàng tiềm năng dựa trên tiêu chí hàng rời khô (Dry Bulk 3.000 - 55.000 DWT) và hàng dự án (MPP/Breakbulk có cẩu).
Loại trừ (Nhóm C): Hàng LCL, đóng gói lẻ siêu thị, container lạnh/reefer, chuyển phát nhanh, tanker xăng dầu.
Nhóm A: Khớp trực tiếp mặt hàng và quy mô lô hàng tàu chuyến (>=80 điểm).
Nhóm B: Tiềm năng nhưng mùa vụ hoặc quy mô biến động (55 - 79 điểm).

Dữ liệu đầu vào:
${JSON.stringify(sanitizedLeads, null, 2)}

Hãy phân tích và trả về đúng định dạng JSON:
{
  "evaluated": [
    {
      "id": "Mã KH",
      "score": number (0-100),
      "group": "A" | "B" | "C",
      "service": "Dry Bulk Chartering" | "Project / Breakbulk" | "Không thuộc phạm vi",
      "vesselFit": "Gợi ý loại tàu và dải tải trọng",
      "reason": "Thuyết minh lý giải ngắn gọn",
      "xaiSteps": [
        "Bước 1: Bóc tách mặt hàng...",
        "Bước 2: Phân tích ngữ cảnh...",
        "Bước 3: Đối chiếu đội tàu SGCL...",
        "Bước 4: Đề xuất hành động tiếp cận..."
      ]
    }
  ]
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            const parsed = JSON.parse(responseText);
            if (Array.isArray(parsed.evaluated)) {
              const merged: EvaluatedLead[] = sanitizedLeads.map(lead => {
                const aiResult = parsed.evaluated.find((item: { id: string }) => item.id === lead.id);
                const localFallback = evaluateLead(lead, rules, 'CONTEXT_MATRIX');
                if (aiResult) {
                  return {
                    ...lead,
                    score: aiResult.score ?? localFallback.score,
                    scoreCargo: localFallback.scoreCargo,
                    scoreRoute: localFallback.scoreRoute,
                    scoreVolume: localFallback.scoreVolume,
                    penalty: localFallback.penalty,
                    autoGroup: aiResult.group || localFallback.autoGroup,
                    group: lead.manualGroup && lead.manualGroup !== 'AUTO' ? lead.manualGroup : (aiResult.group || localFallback.group),
                    service: aiResult.service || localFallback.service,
                    vesselFit: aiResult.vesselFit || localFallback.vesselFit,
                    reason: aiResult.reason || localFallback.reason,
                    xaiSteps: aiResult.xaiSteps || localFallback.xaiSteps,
                    status: lead.status
                  };
                }
                return localFallback;
              });

              return NextResponse.json({
                success: true,
                mode: 'GEMINI_AI',
                leads: merged
              });
            }
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to Contextual Rule Engine:', err);
      }
    }

    // Default or Fallback: Evaluate with local Contextual Rule Engine
    const evaluated = sanitizedLeads.map(lead => evaluateLead(lead, rules, 'CONTEXT_MATRIX'));

    return NextResponse.json({
      success: true,
      mode: 'CONTEXT_MATRIX',
      leads: evaluated
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi trong quá trình xử lý: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
