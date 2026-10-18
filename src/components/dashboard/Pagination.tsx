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
  currentPage, totalPages, rowsPerPage, onPageChange, onRowsPerPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (currentPage <= 4) return i + 1;
    if (currentPage >= totalPages - 3) return totalPages - 6 + i;
    return currentPage - 3 + i;
  });

  return (
    <div className="flex items-center space-x-2">
      {/* Rows per page */}
      <select
        value={rowsPerPage}
        onChange={e => onRowsPerPageChange(parseInt(e.target.value))}
        className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1.5 bg-white cursor-pointer focus:outline-none"
      >
        <option value={8}>8 / trang</option>
        <option value={15}>15 / trang</option>
        <option value={50}>50 / trang</option>
      </select>

      {/* Prev */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-3 py-1.5 text-xs rounded-lg border transition cursor-pointer ${
          currentPage <= 1
            ? 'border-gray-100 text-gray-300 cursor-not-allowed'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        ‹
      </button>

      {/* Pages */}
      {pages.map(p => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 text-xs rounded-lg font-medium transition cursor-pointer ${
            p === currentPage
              ? 'bg-[#0F3D75] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-3 py-1.5 text-xs rounded-lg border transition cursor-pointer ${
          currentPage >= totalPages
            ? 'border-gray-100 text-gray-300 cursor-not-allowed'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        ›
      </button>
    </div>
  );
}
