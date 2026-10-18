'use client';

import { KpiMetrics } from '@/lib/types/kpi';

interface KpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: KpiMetrics;
}

export default function KpiModal({ isOpen, onClose, metrics }: KpiModalProps) {
  if (!isOpen) return null;

  const total = metrics.total || 1;
  const pctA = Math.round((metrics.groupACount / total) * 100);
  const pctB = Math.round((metrics.groupBCount / total) * 100);
  const pctC = Math.max(0, 100 - pctA - pctB);

  // Donut chart math (r = 45, circumference ≈ 282.74)
  const radius = 45;
  const circ = 2 * Math.PI * radius;
  const dashA = (metrics.groupACount / total) * circ;
  const dashB = (metrics.groupBCount / total) * circ;
  const dashC = (metrics.groupCCount / total) * circ;
  const offsetA = 0;
  const offsetB = -dashA;
  const offsetC = -(dashA + dashB);

  // Time comparison bar math
  const maxTime = Math.max(metrics.manualMinutes, 1);
  const manualPct = 100;
  const assistedPct = Math.max(6, Math.round((metrics.assistedMinutes / maxTime) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kpiModalTitle"
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 id="kpiModalTitle" className="text-base font-bold text-slate-900">
              Báo cáo Đo lường Hiệu suất Sàng lọc &amp; Kiểm soát Rủi ro (KPIs &amp; ROI)
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Đo lường thời gian tiết kiệm và tỷ lệ sàng lọc đối tượng tự động phục vụ phòng Chartering
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="text-slate-400 hover:text-slate-700 text-xl font-bold px-2 py-1 cursor-pointer rounded"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm overflow-y-auto">
          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 font-semibold block uppercase">Thời gian lọc thủ công</span>
              <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
                {metrics.manualMinutes} <span className="text-sm font-normal text-slate-500">phút</span>
              </span>
              <span className="text-xs text-slate-400 mt-0.5 block">Định mức ~5 phút tra cứu / DN</span>
            </div>
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-lg">
              <span className="text-xs text-emerald-800 font-semibold block uppercase">Thời gian có Hệ thống AI</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
                {metrics.assistedMinutes} <span className="text-sm font-normal text-slate-500">phút</span>
              </span>
              <span className="text-xs text-emerald-600 mt-0.5 block">Xử lý tự động + Broker duyệt A/B</span>
            </div>
            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg">
              <span className="text-xs text-[#2b6cb0] font-semibold block uppercase">Tỷ lệ tiết kiệm thời gian</span>
              <span className="text-2xl font-bold font-mono text-[#4299e1] mt-1 block">
                {metrics.savedPct}%
              </span>
              <span className="text-xs text-blue-600 mt-0.5 block">Mục tiêu yêu cầu: Tiết kiệm &ge;80%</span>
            </div>
          </div>

          {/* VISUAL CHARTS SECTION (BIỂU ĐỒ TRÒN & BIỂU ĐỒ CỘT) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Biểu đồ tròn: Cơ cấu phân bổ Khách hàng */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800 text-sm">Cơ cấu Phân bổ Nhóm Đối tượng</span>
                <span className="text-xs font-mono font-semibold text-slate-500">Tổng: {metrics.total} DN</span>
              </div>
              <div className="flex items-center justify-center space-x-6 py-2">
                {/* SVG Donut */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={radius} className="stroke-slate-100" strokeWidth="18" fill="transparent" />
                    {/* Segment A */}
                    {metrics.groupACount > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        className="stroke-[#4299e1] transition-all duration-500"
                        strokeWidth="18"
                        strokeDasharray={`${dashA} ${circ}`}
                        strokeDashoffset={offsetA}
                        fill="transparent"
                      />
                    )}
                    {/* Segment B */}
                    {metrics.groupBCount > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        className="stroke-amber-400 transition-all duration-500"
                        strokeWidth="18"
                        strokeDasharray={`${dashB} ${circ}`}
                        strokeDashoffset={offsetB}
                        fill="transparent"
                      />
                    )}
                    {/* Segment C */}
                    {metrics.groupCCount > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        className="stroke-slate-300 transition-all duration-500"
                        strokeWidth="18"
                        strokeDasharray={`${dashC} ${circ}`}
                        strokeDashoffset={offsetC}
                        fill="transparent"
                      />
                    )}
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-lg font-bold font-mono text-slate-800 block leading-tight">{metrics.total}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Hồ sơ</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-sm bg-[#4299e1] shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-700 block">Nhóm A (Cốt lõi)</span>
                      <span className="font-mono text-slate-500">{metrics.groupACount} DN ({metrics.groupAPct}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-sm bg-amber-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-700 block">Nhóm B (Tiềm năng)</span>
                      <span className="font-mono text-slate-500">{metrics.groupBCount} DN ({metrics.groupBPct}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-sm bg-slate-300 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-700 block">Nhóm C (Loại trừ)</span>
                      <span className="font-mono text-slate-500">{metrics.groupCCount} DN ({metrics.groupCPct}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Biểu đồ cột ngang: So sánh thời gian thẩm định */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800 text-sm">So sánh Năng suất &amp; Thời gian</span>
                <span className="text-xs font-mono font-bold text-emerald-700">Tiết kiệm {metrics.savedPct}%</span>
              </div>
              <div className="space-y-4 py-1">
                {/* Manual Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">Thẩm định thủ công (Excel rời):</span>
                    <span className="font-mono font-bold text-slate-700">{metrics.manualMinutes} phút</span>
                  </div>
                  <div className="w-full h-5 bg-slate-100 rounded overflow-hidden flex">
                    <div
                      style={{ width: `${manualPct}%` }}
                      className="bg-slate-400 h-full flex items-center px-2 text-[11px] font-mono font-bold text-white"
                    >
                      ~5 phút / hồ sơ
                    </div>
                  </div>
                </div>

                {/* Assisted Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-emerald-800">Có Hệ thống AI &amp; Ma trận quy tắc:</span>
                    <span className="font-mono font-bold text-emerald-700">{metrics.assistedMinutes} phút</span>
                  </div>
                  <div className="w-full h-5 bg-slate-100 rounded overflow-hidden flex">
                    <div
                      style={{ width: `${assistedPct}%` }}
                      className="bg-emerald-500 h-full flex items-center px-2 text-[11px] font-mono font-bold text-white transition-all duration-500"
                    >
                      {metrics.assistedMinutes}p
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-xs text-emerald-900 flex items-center justify-between">
                  <span>Thời gian thực tế giải phóng cho Broker:</span>
                  <span className="font-bold font-mono text-emerald-700">~{metrics.hoursSaved} giờ làm việc</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Metric Table */}
          <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-700">
              <tr>
                <th className="py-2.5 px-3.5 border-r border-slate-200">Chỉ tiêu đo lường kỹ thuật (KPIs)</th>
                <th className="py-2.5 px-3.5 border-r border-slate-200 text-right">Trên DS đang nạp</th>
                <th className="py-2.5 px-3.5 text-right">Quy chiếu 350 DN (Năm 2025)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-sm">
              <tr>
                <td className="py-2.5 px-3.5 font-sans text-slate-700 border-r border-slate-200">
                  Tổng số đối tượng đầu vào
                </td>
                <td className="py-2.5 px-3.5 text-right border-r border-slate-200 font-semibold">
                  {metrics.total} DN
                </td>
                <td className="py-2.5 px-3.5 text-right font-semibold">350 DN</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-sans text-slate-700 border-r border-slate-200">
                  Số đối tượng không phù hợp bị loại tự động (Nhóm C)
                </td>
                <td className="py-2.5 px-3.5 text-right text-slate-600 border-r border-slate-200">
                  {metrics.groupCCount} DN ({metrics.groupCPct}%)
                </td>
                <td className="py-2.5 px-3.5 text-right text-slate-600">170 DN (48,57%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-sans text-slate-700 border-r border-slate-200">
                  Số đối tượng Đạt chuyển cho Broker (Nhóm A + B)
                </td>
                <td className="py-2.5 px-3.5 text-right font-bold text-emerald-700 border-r border-slate-200">
                  {metrics.suitableCount} DN ({metrics.suitablePct}%)
                </td>
                <td className="py-2.5 px-3.5 text-right font-bold text-emerald-700">180 DN (51,43%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-sans text-slate-700 border-r border-slate-200">
                  Tổng giờ công Broker tiết kiệm được
                </td>
                <td className="py-2.5 px-3.5 text-right font-bold text-[#4299e1] border-r border-slate-200">
                  {metrics.hoursSaved} giờ
                </td>
                <td className="py-2.5 px-3.5 text-right font-bold text-[#4299e1]">~24,5 giờ làm việc</td>
              </tr>
            </tbody>
          </table>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-800 text-sm">Cơ chế Kiểm soát Rủi ro &amp; Bảo mật vận hành:</p>
            <p>
              &bull; <strong>Kiểm soát độ chính xác:</strong> Tích hợp bộ lọc từ khóa loại trừ (Negative Gate) ngăn chặn lỗi bắt nhầm hàng đóng gói lẻ/LCL.
            </p>
            <p>
              &bull; <strong>Bảo mật dữ liệu:</strong> Dữ liệu chạy cục bộ trên trình duyệt và lưu tại <code className="font-mono">localStorage</code> nội bộ, hỗ trợ mã hóa thông tin liên hệ nhạy cảm.
            </p>
            <p>
              &bull; <strong>Chi phí vận hành:</strong> Tối ưu hóa nhờ thuật toán ngữ cảnh nội bộ kết hợp tùy chọn Google Gemini Cloud API.
            </p>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end text-sm">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#4299e1] hover:bg-[#3182ce] text-white font-medium rounded-md transition cursor-pointer shadow-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
