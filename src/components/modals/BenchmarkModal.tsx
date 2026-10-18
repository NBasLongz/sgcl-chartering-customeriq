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
      <div className="bg-white border border-slate-300 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 id="benchmarkModalTitle" className="text-base font-bold text-slate-900">
              Số liệu Thực tế Hoạt động Tìm kiếm &amp; Tiếp cận tại SGCL (2024 &ndash; 2025)
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Số liệu thống kê thực tế từ Bộ phận Môi giới Tàu biển (Chartering Department)
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
          <p className="text-slate-600 leading-relaxed text-sm">
            Bảng dưới đây đối chiếu số liệu thống kê thực trạng năm 2024 &ndash; 2025 tại SGCL. Trong năm 2025, công ty tìm kiếm được <strong>350</strong> đối tượng nhưng chỉ có <strong>180</strong> đối tượng phù hợp (tỷ lệ <strong>51,43%</strong>), tức có <strong>170</strong> đối tượng không phù hợp cần được sàng lọc tự động ngay từ đầu vào.
          </p>

          <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-700">
              <tr>
                <th className="py-2.5 px-3.5 border-r border-slate-200">Chỉ tiêu đánh giá</th>
                <th className="py-2.5 px-3.5 border-r border-slate-200">Đơn vị</th>
                <th className="py-2.5 px-3.5 border-r border-slate-200 text-right">Năm 2024</th>
                <th className="py-2.5 px-3.5 border-r border-slate-200 text-right">Năm 2025</th>
                <th className="py-2.5 px-3.5 text-right">So sánh (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-sm">
              {BENCHMARK_METRICS.map((row, idx) => {
                const rowBg = row.highlight ? 'bg-blue-50/40' : '';
                return (
                  <tr key={idx} className={rowBg}>
                    <td
                      className={`py-2.5 px-3.5 font-sans border-r border-slate-200 ${
                        row.highlight
                          ? 'font-semibold text-slate-900'
                          : 'font-medium text-slate-800'
                      }`}
                    >
                      {row.criterion}
                    </td>
                    <td className="py-2.5 px-3.5 font-sans text-slate-500 border-r border-slate-200">
                      {row.unit}
                    </td>
                    <td className="py-2.5 px-3.5 text-right border-r border-slate-200">
                      {row.year2024}
                    </td>
                    <td
                      className={`py-2.5 px-3.5 text-right border-r border-slate-200 ${
                        row.highlight ? 'font-bold' : ''
                      }`}
                    >
                      {row.year2025}
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-emerald-700 font-semibold">
                      {row.changePct}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end text-sm">
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
