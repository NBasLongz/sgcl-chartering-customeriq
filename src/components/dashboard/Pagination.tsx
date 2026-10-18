'use client';

interface PaginationProps {
  totalLeads: number;
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export default function Pagination({
  totalLeads,
  filteredCount,
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}: PaginationProps) {
  const startIdx = (currentPage - 1) * rowsPerPage;
  const from = filteredCount === 0 ? 0 : startIdx + 1;
  const to = Math.min(startIdx + rowsPerPage, filteredCount);

  return (
    <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600 shrink-0">
      <div className="flex items-center space-x-3">
        <span>
          {filteredCount === 0 ? (
            <>
              Hiển thị <span className="font-mono font-semibold">0</span> trên tổng số{' '}
              <span className="font-mono font-semibold">{totalLeads}</span> hồ sơ
            </>
          ) : (
            <>
              Hiển thị{' '}
              <span className="font-mono font-semibold text-slate-800">
                {from}–{to}
              </span>{' '}
              trong{' '}
              <span className="font-mono font-semibold text-slate-800">
                {filteredCount}
              </span>{' '}
              hồ sơ khớp bộ lọc (Tổng danh sách:{' '}
              <span className="font-mono">{totalLeads}</span>)
            </>
          )}
        </span>
        <span className="text-slate-300">|</span>
        <label className="flex items-center space-x-1.5">
          <span className="text-slate-500">Số dòng/trang:</span>
          <select
            value={rowsPerPage}
            onChange={e => onRowsPerPageChange(parseInt(e.target.value, 10))}
            className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-sm font-mono cursor-pointer focus:border-[#0F3D75] focus:outline-none"
          >
            <option value={8}>8</option>
            <option value={15}>15</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-3.5 py-1.5 rounded-md border text-sm transition ${
            currentPage <= 1
              ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer'
          }`}
        >
          Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`px-3.5 py-1.5 rounded-md border font-mono font-semibold text-sm transition cursor-pointer ${
              p === currentPage
                ? 'border-[#0F3D75] bg-[#0F3D75] text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-3.5 py-1.5 rounded-md border text-sm transition ${
            currentPage >= totalPages
              ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer'
          }`}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
