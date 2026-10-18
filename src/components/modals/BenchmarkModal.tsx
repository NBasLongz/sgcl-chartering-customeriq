'use client';

import { BENCHMARK_METRICS } from '@/lib/data/benchmark-data';

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BenchmarkModal({ isOpen, onClose }: BenchmarkModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="benchmarkModalTitle"
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div className="bg-white border border-slate-300 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 id="benchmarkModalTitle" className="text-sm font-bold text-slate-900">
              Số liệu Tham chiếu Hoạt động Tìm kiếm &amp; Tiếp cận tại SGCL (2024 &ndash; 2025)
            </h3>
            <p className="text-xs text-slate-500">
              Số liệu ước tính phục vụ nghiên cứu từ Bộ phận Chartering (Bảng 2.1, Bảng 2.2 &amp; Phụ lục A trong Báo cáo)
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
          <p className="text-slate-600 leading-relaxed">
            Bảng dưới đây đối chiếu số liệu thống kê thực trạng năm 2024 &ndash; 2025 tại SGCL. Trong năm 2025, công ty tìm kiếm được <strong>350</strong> đối tượng nhưng chỉ có <strong>180</strong> đối tượng phù hợp (tỷ lệ <strong>51,43%</strong>), tức có <strong>170</strong> đối tượng không phù hợp cần được sàng lọc tự động ngay từ đầu vào.
          </p>

          <table className="w-full text-left border-collapse border border-slate-200">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
              <tr>
                <th className="py-2 px-3 border-r border-slate-200">Chỉ tiêu đánh giá</th>
                <th className="py-2 px-3 border-r border-slate-200">Đơn vị</th>
                <th className="py-2 px-3 border-r border-slate-200 text-right">Năm 2024</th>
                <th className="py-2 px-3 border-r border-slate-200 text-right">Năm 2025</th>
                <th className="py-2 px-3 text-right">So sánh (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {BENCHMARK_METRICS.map((row, idx) => {
                const rowBg = row.highlight ? 'bg-blue-50/40' : '';
                return (
                  <tr key={idx} className={rowBg}>
                    <td
                      className={`py-2 px-3 font-sans border-r border-slate-200 ${
                        row.highlight
                          ? 'font-semibold text-slate-900'
                          : 'font-medium text-slate-800'
                      }`}
                    >
                      {row.criterion}
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-500 border-r border-slate-200">
                      {row.unit}
                    </td>
                    <td className="py-2 px-3 text-right border-r border-slate-200">
                      {row.year2024}
                    </td>
                    <td
                      className={`py-2 px-3 text-right border-r border-slate-200 ${
                        row.highlight ? 'font-bold' : ''
                      }`}
                    >
                      {row.year2025}
                    </td>
                    <td className="py-2 px-3 text-right text-emerald-700">
                      {row.changePct}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
