'use client';

import { EngineMode } from '@/lib/types/rules';

interface ToolbarProps {
  totalLeads: number;
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  groupFilter: string;
  onGroupFilterChange: (g: string) => void;
  engineMode: EngineMode;
  onEngineModeChange: (m: EngineMode) => void;
  onResetFilters: () => void;
  isLoadingAi?: boolean;
}

const ENGINE_OPTIONS: { value: EngineMode; label: string; badge?: string }[] = [
  { value: 'CONTEXT_MATRIX', label: 'Ma trận Ngữ cảnh (Nội bộ)', badge: 'Nhanh' },
  { value: 'CLOUD_AI', label: 'Google Gemini AI Cloud', badge: 'AI' },
  { value: 'NAIVE_KEYWORD', label: 'Quét từ khóa đơn (Đối chứng)' },
];

export default function Toolbar({
  totalLeads, filteredCount, searchQuery, onSearchChange,
  groupFilter, onGroupFilterChange, engineMode, onEngineModeChange,
  onResetFilters, isLoadingAi,
}: ToolbarProps) {

  const groups = [
    { value: 'ALL',      label: 'Tất cả' },
    { value: 'SUITABLE', label: 'Đạt (A + B)' },
    { value: 'A',        label: 'Nhóm A' },
    { value: 'B',        label: 'Nhóm B' },
    { value: 'C',        label: 'Nhóm C' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-5 py-3 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Tìm tên công ty, mặt hàng, cảng..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0F3D75] focus:bg-white transition"
        />
      </div>

      {/* Group Filter Tabs */}
      <div className="flex items-center bg-gray-100 rounded-lg p-1 space-x-1">
        {groups.map(g => (
          <button
            key={g.value}
            type="button"
            onClick={() => onGroupFilterChange(g.value)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
              groupFilter === g.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Result Count */}
      {(searchQuery || groupFilter !== 'ALL') && (
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500">
            <span className="font-bold text-gray-900">{filteredCount}</span> / {totalLeads} kết quả
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-[#0F3D75] hover:underline font-medium cursor-pointer"
          >
            Xóa lọc
          </button>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Engine Mode */}
      <div className="flex items-center space-x-2">
        {isLoadingAi && (
          <div className="flex items-center space-x-1.5 text-xs text-blue-600">
            <div className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="font-medium">Đang phân tích AI...</span>
          </div>
        )}
        <label className="text-xs text-gray-500 font-medium whitespace-nowrap">Cơ chế:</label>
        <select
          value={engineMode}
          onChange={e => onEngineModeChange(e.target.value as EngineMode)}
          className={`text-xs font-semibold px-3 py-2 rounded-lg border cursor-pointer focus:outline-none transition ${
            engineMode === 'CLOUD_AI'
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : engineMode === 'NAIVE_KEYWORD'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-gray-50 border-gray-200 text-gray-800'
          }`}
        >
          {ENGINE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
