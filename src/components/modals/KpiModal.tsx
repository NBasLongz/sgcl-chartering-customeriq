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
      <div className="bg-white border border-slate-300 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 id="kpiModalTitle" className="text-sm font-bold text-slate-900">
              Báo cáo Đo lường Hiệu suất Sàng lọc &amp; Kiểm soát Rủi ro (Mục 3.4 &amp; 3.5)
            </h3>
            <p className="text-xs text-slate-500">
              Đo lường định lượng thời gian tiết kiệm và tỷ lệ lọc rác dữ liệu theo yêu cầu của GVHD
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="text-slate-400 hover:text-slate-700 text-lg font-bold px-1 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Thời gian lọc thủ công (Ước tính)</span>
              <span className="text-base font-bold font-mono text-slate-800 mt-1 block">
                {metrics.manualMinutes} phút
              </span>
              <span className="text-[10px] text-slate-400">Định mức ~5 phút tra cứu/doanh nghiệp</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Thời gian có Hệ thống hỗ trợ</span>
              <span className="text-base font-bold font-mono text-emerald-700 mt-1 block">
                {metrics.assistedMinutes} phút
              </span>
              <span className="text-[10px] text-slate-400">Xử lý tự động + Broker duyệt Nhóm A/B</span>
            </div>
            <div className="p-3 bg-blue-50/60 border border-blue-200">
              <span className="text-[11px] text-[#0F3D75] font-medium block">Tỷ lệ tiết kiệm thời gian</span>
              <span className="text-base font-bold font-mono text-[#0F3D75] mt-1 block">
                {metrics.savedPct}%
              </span>
              <span className="text-[10px] text-slate-500">Mục tiêu đề tài: Giảm &ge; 80% thời gian</span>
            </div>
          </div>

          <table className="w-full text-left border-collapse border border-slate-200">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
              <tr>
                <th className="py-2 px-3 border-r border-slate-200">Chỉ tiêu đo lường kỹ thuật (KPIs)</th>
                <th className="py-2 px-3 border-r border-slate-200 text-right">Trên DS đang nạp</th>
                <th className="py-2 px-3 text-right">Quy chiếu 350 DN (Năm 2025)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700 border-r border-slate-200">
                  Tổng số đối tượng đầu vào
                </td>
                <td className="py-2 px-3 text-right border-r border-slate-200">
                  {metrics.total} DN
                </td>
                <td className="py-2 px-3 text-right">350 DN</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700 border-r border-slate-200">
                  Số đối tượng không phù hợp bị loại tự động (Nhóm C)
                </td>
                <td className="py-2 px-3 text-right text-slate-600 border-r border-slate-200">
                  {metrics.groupCCount} DN ({metrics.groupCPct}%)
                </td>
                <td className="py-2 px-3 text-right text-slate-600">170 DN (48,57%)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700 border-r border-slate-200">
                  Số đối tượng Đạt chuyển cho Broker (Nhóm A + B)
                </td>
                <td className="py-2 px-3 text-right font-bold text-emerald-700 border-r border-slate-200">
                  {metrics.suitableCount} DN ({metrics.suitablePct}%)
                </td>
                <td className="py-2 px-3 text-right font-bold text-emerald-700">180 DN (51,43%)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700 border-r border-slate-200">
                  Tổng giờ công Broker tiết kiệm được
                </td>
                <td className="py-2 px-3 text-right font-bold text-[#0F3D75] border-r border-slate-200">
                  {metrics.hoursSaved} giờ
                </td>
                <td className="py-2 px-3 text-right font-bold text-[#0F3D75]">~24,5 giờ làm việc</td>
              </tr>
            </tbody>
          </table>

          <div className="p-3 bg-slate-50 border border-slate-200 space-y-1.5 text-[11px] text-slate-600">
            <p className="font-semibold text-slate-800">Cơ chế Kiểm soát Rủi ro &amp; Bảo mật đang kích hoạt (Mục 3.5):</p>
            <p>
              &bull; <strong>Kiểm soát độ chính xác (Mục 3.5.1):</strong> Tích hợp bộ lọc từ khóa loại trừ (Negative Gate) ngăn chặn lỗi bắt nhầm hàng đóng gói lẻ/LCL.
            </p>
            <p>
              &bull; <strong>Bảo mật dữ liệu (Mục 3.5.2):</strong> Dữ liệu chạy cục bộ trên trình duyệt và lưu tại <code className="font-mono">localStorage</code> nội bộ, ẩn danh thông tin liên hệ cá nhân trước khi phân tích.
            </p>
            <p>
              &bull; <strong>Chi phí vận hành (Mục 3.5.3):</strong> 0 VNĐ (Tận dụng thuật toán ngữ cảnh nội bộ kết hợp tùy chọn Google Gemini Flash Free Tier).
            </p>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0F3D75] text-white font-medium hover:bg-[#0A2B54] transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
