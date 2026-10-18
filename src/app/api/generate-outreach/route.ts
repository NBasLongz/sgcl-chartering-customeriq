import { NextRequest, NextResponse } from 'next/server';
import { EvaluatedLead } from '@/lib/types/lead';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lead: EvaluatedLead = body.lead;
    const language: 'VI' | 'EN' = body.language || 'VI';

    if (!lead || !lead.company) {
      return NextResponse.json({ error: 'Thông tin hồ sơ không hợp lệ.' }, { status: 400 });
    }

    let subject = '';
    let emailBody = '';

    if (language === 'VI') {
      subject = `[SGCL Chartering] Đề xuất phương án tàu vận chuyển ${lead.cargo} (${lead.volume}) - Tuyến ${lead.route}`;
      emailBody = `Kính gửi Phòng Xuất Nhập Khẩu / Logistics - ${lead.company},

Tôi là Chuyên viên Môi giới Tàu biển (Chartering Executive) từ Công ty Cổ phần Dịch vụ Tiếp vận và Thương mại Sài Gòn Cửu Long (SGCL).

Qua theo dõi nhu cầu vận chuyển trên tuyến ${lead.route}, SGCL được biết Quý Công ty thường xuyên có các lô hàng ${lead.cargo} với quy mô khoảng ${lead.volume}.

Hiện tại, mạng lưới hơn 90 chủ tàu đối tác trong nước và quốc tế của SGCL đang có các vị trí tàu ${lead.vesselFit} mở (open) tại khu vực Đông Nam Á / Đông Á rất phù hợp để nhận hàng của Quý Công ty với mức cước cạnh tranh.

Để SGCL có thể gửi Báo giá chỉ dẫn (Indicative Freight Offer) và đề xuất tàu sát nhất, Quý Công ty vui lòng cho xin thêm các thông số dự kiến của lô hàng sắp tới:
1. Khối lượng chuẩn & Hệ số chất xếp (Volume & Stowage Factor - SF): ${lead.volume}
2. Cảng xếp / Cảng dỡ cụ thể (POL / POD & Max Draft): ${lead.route}
3. Thời gian hàng sẵn sàng (Laycan): [Vui lòng cập nhật]
4. Tốc độ làm hàng hai đầu cảng (Loading / Discharging Rate): [Vui lòng cập nhật]

Rất mong nhận được phản hồi của Quý Công ty để hai bên trao đổi chi tiết hơn.

Trân trọng,
Bộ phận Thuê tàu & Môi giới Hàng hải (Chartering Department)
Saigon Cuulong JSC (SGCL) | 20/5 Tân Cảng, TP. Hồ Chí Minh`;
    } else {
      subject = `[SGCL Chartering] Vessel Tonnage Proposal for ${lead.cargo} (${lead.volume}) // ${lead.route}`;
      emailBody = `Dear Chartering / Logistics Team at ${lead.company},

Good day. We are contacting you from the Chartering Department of Saigon Cuulong JSC (SGCL) - Dry Bulk & Project Cargo Shipbrokers in Ho Chi Minh City.

Understanding your regular shipping activities for ${lead.cargo} (${lead.volume}) on the trade lane ${lead.route}, we would like to introduce our direct tonnage positions (${lead.vesselFit}) from our network of 90+ domestic and international shipowners.

Could you kindly share your next firm cargo inquiry or indicative schedule with the following details so we can provide a competitive freight indication:
- Commodity & Quantity: ${lead.cargo} (${lead.volume})
- POL / POD & Port Restrictions (Max Draft / LOA): ${lead.route}
- Laycan: [Please advise]
- Load / Discharge Rates (L/D Rate SHINC/SHEX): [Please advise]
- Freight Idea / Commission structure: [Please advise]

We look forward to hearing from you and supporting your upcoming fixtures.

Best Regards,
Chartering Department — Saigon Cuulong JSC (SGCL)
Add: SGCL Building, 20/5 Tan Cang St., HCMC, Vietnam`;
    }

    return NextResponse.json({
      success: true,
      subject,
      emailBody,
      company: lead.company,
      recommendedVessel: lead.vesselFit
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
