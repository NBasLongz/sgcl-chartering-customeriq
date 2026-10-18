'use client';

interface AppHeaderProps {
  totalLeads: number;
  suitableCount: number;
  onOpenKpi: () => void;
  onOpenUpload: () => void;
  onExport: () => void;
  onReset: () => void;
}

export default function AppHeader({
  totalLeads,
  suitableCount,
  onOpenKpi,
  onOpenUpload,
  onExport,
  onReset,
}: AppHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-0 flex items-center justify-between h-14 shrink-0">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <span className="bg-[#0F3D75] text-white font-black px-2.5 py-1 text-xs tracking-widest rounded">
          SGCL
        </span>
        <span className="text-gray-800 font-bold text-sm hidden sm:block">CustomerIQ</span>
        <span className="text-gray-200 hidden md:block">·</span>
        <span className="text-gray-400 text-sm hidden md:block">Sàng lọc Khách hàng Chartering</span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onOpenKpi}
          className="hidden md:flex items-center space-x-1.5 text-sm text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>KPIs</span>
        </button>

        <button
          type="button"
          onClick={onOpenUpload}
          className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Nạp file</span>
        </button>

        {totalLeads > 0 && (
          <button
            type="button"
            onClick={onExport}
            className="flex items-center space-x-1.5 text-sm font-semibold text-white bg-[#0F3D75] px-4 py-2 rounded-lg hover:bg-[#0A2B54] transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Xuất DS đạt ({suitableCount})</span>
          </button>
        )}

        {totalLeads > 0 && (
          <button
            type="button"
            onClick={onReset}
            title="Xóa dữ liệu, quay về trang đầu"
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
