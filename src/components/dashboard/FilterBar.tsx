'use client';

import { EngineMode } from '@/lib/types/rules';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  groupFilter: string;
  onGroupFilterChange: (group: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (service: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onResetFilters: () => void;
  engineMode: EngineMode;
  onEngineModeChange: (mode: EngineMode) => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  groupFilter,
  onGroupFilterChange,
  serviceFilter,
  onServiceFilterChange,
  statusFilter,
  onStatusFilterChange,
  onResetFilters,
  engineMode,
  onEngineModeChange
}: FilterBarProps) {
  return (
    <div className="px-4 lg:px-6 py-2.5 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="search"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Tìm kiếm doanh nghiệp, mã KH, mặt hàng, tuyến cảng"
            placeholder="Tìm tên DN, mã KH, mặt hàng, cảng..."
            className="w-full bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0F3D75] focus:outline-none"
          />
        </div>

        {/* Group filter */}
        <select
          value={groupFilter}
          onChange={e => onGroupFilterChange(e.target.value)}
          aria-label="Lọc theo phân nhóm khách hàng"
          className="bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 cursor-pointer focus:border-[#0F3D75] focus:outline-none"
        >
          <option value="ALL">Phân nhóm: Tất cả</option>
          <option value="SUITABLE">Nhóm đạt (A &amp; B)</option>
          <option value="A">Nhóm A — Mục tiêu cốt lõi</option>
          <option value="B">Nhóm B — Tiềm năng theo dõi</option>
          <option value="C">Nhóm C — Loại trừ</option>
        </select>

        {/* Service filter */}
        <select
          value={serviceFilter}
          onChange={e => onServiceFilterChange(e.target.value)}
          aria-label="Lọc theo nghiệp vụ khai thác"
          className="bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 cursor-pointer focus:border-[#0F3D75] focus:outline-none"
        >
          <option value="ALL">Nghiệp vụ: Tất cả</option>
          <option value="Dry Bulk Chartering">Dry Bulk Chartering</option>
          <option value="Project / Breakbulk">Project / Breakbulk</option>
          <option value="Không thuộc phạm vi">Không thuộc phạm vi (Nhóm C)</option>
        </select>

        {/* Broker review status filter */}
        <select
          value={statusFilter}
          onChange={e => onStatusFilterChange(e.target.value)}
          aria-label="Lọc theo trạng thái thẩm định của Broker"
          className="bg-white border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 cursor-pointer focus:border-[#0F3D75] focus:outline-none"
        >
          <option value="ALL">Trạng thái: Tất cả</option>
          <option value="Đã duyệt tiếp cận">Đã duyệt tiếp cận</option>
          <option value="Giao Senior Broker">Giao Senior Broker</option>
          <option value="Đưa vào lịch chăm sóc">Đưa vào lịch chăm sóc</option>
          <option value="Cần Broker kiểm tra lại">Cần Broker kiểm tra lại</option>
          <option value="Đã loại trừ">Đã loại trừ</option>
        </select>

        <button
          type="button"
          onClick={onResetFilters}
          className="px-2 py-1.5 text-slate-500 hover:text-slate-800 underline decoration-slate-300 cursor-pointer"
        >
          Đặt lại bộ lọc
        </button>
      </div>

      {/* Classification Engine Mode Selector */}
      <div className="flex items-center space-x-2">
        <label htmlFor="methodSelect" className="text-[11px] font-medium text-slate-600">
          Cơ chế phân loại:
        </label>
        <select
          id="methodSelect"
          value={engineMode}
          onChange={e => onEngineModeChange(e.target.value as EngineMode)}
          className="bg-white border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-800 cursor-pointer focus:border-[#0F3D75] focus:outline-none"
        >
          <option value="CONTEXT_MATRIX">Phân tích Ngữ cảnh Đa chiều &amp; XAI (Khuyên dùng)</option>
          <option value="NAIVE_KEYWORD">Quét từ khóa đơn thuần (Đối chứng lỗi bắt nhầm)</option>
        </select>
      </div>
    </div>
  );
}
