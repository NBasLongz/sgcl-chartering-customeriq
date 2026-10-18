'use client';

import { KpiMetrics } from '@/lib/types/kpi';

interface KpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: KpiMetrics;
}

export default function KpiModal({ isOpen, onClose, metrics }: KpiModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kpiModalTitle"
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div className="bg-white border border-slate-300 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 id="kpiModalTitle" className="text-base font-bold text-slate-900">
              Báo cáo Đo lường Hiệu suất Sàng lọc &amp; Kiểm soát Rủi ro
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

        <div className="p-5 space-y-4 text-sm overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-sm text-slate-500 block">Thời gian lọc thủ công (Ước tính)</span>
              <span className="text-xl font-bold font-mono text-slate-800 mt-1 block">
                {metrics.manualMinutes} phút
              </span>
              <span className="text-xs text-slate-400">Định mức ~5 phút tra cứu / DN</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-sm text-slate-500 block">Thời gian có Hệ thống hỗ trợ</span>
              <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block">
                {metrics.assistedMinutes} phút
              </span>
              <span className="text-xs text-slate-400">Xử lý tự động + Broker duyệt Nhóm A/B</span>
            </div>
            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg">
              <span className="text-sm text-[#0F3D75] font-semibold block">Tỷ lệ tiết kiệm thời gian</span>
              <span className="text-xl font-bold font-mono text-[#0F3D75] mt-1 block">
                {metrics.savedPct}%
              </span>
              <span className="text-xs text-slate-500">Mục tiêu: Tiết kiệm &ge;80% thời gian</span>
            </div>
          </div>

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
                <td className="py-2.5 px-3.5 text-right font-bold text-[#0F3D75] border-r border-slate-200">
                  {metrics.hoursSaved} giờ
                </td>
                <td className="py-2.5 px-3.5 text-right font-bold text-[#0F3D75]">~24,5 giờ làm việc</td>
              </tr>
            </tbody>
          </table>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-sm text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-800">Cơ chế Kiểm soát Rủi ro &amp; Bảo mật vận hành:</p>
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

        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end text-sm">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#0F3D75] text-white font-medium rounded-md hover:bg-[#0A2B54] transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
