'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLeadsManager } from '@/lib/hooks/useLeadsManager';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MetricsBar from '@/components/dashboard/MetricsBar';
import FilterBar from '@/components/dashboard/FilterBar';
import NaiveModeWarning from '@/components/dashboard/NaiveModeWarning';
import LeadTable from '@/components/dashboard/LeadTable';
import Pagination from '@/components/dashboard/Pagination';
import InspectionDrawer from '@/components/inspection/InspectionDrawer';
import EmptyState from '@/components/dashboard/EmptyState';
import OutreachModal from '@/components/modals/OutreachModal';
import KpiModal from '@/components/modals/KpiModal';
import RulesModal from '@/components/modals/RulesModal';
import UploadModal from '@/components/modals/UploadModal';
import BenchmarkModal from '@/components/modals/BenchmarkModal';
import Toast from '@/components/ui/Toast';

export default function Home() {
  const {
    paginatedLeads,
    totalCount,
    filteredCount,
    totalPages,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    rules,
    engineMode,
    setEngineMode,
    activePreset,
    applyPresetView,
    searchQuery,
    setSearchQuery,
    groupFilter,
    setGroupFilter,
    serviceFilter,
    setServiceFilter,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    toggleSort,
    resetFilters,
    selectedLead,
    selectedLeadId,
    setSelectedLeadId,
    activeModal,
    setActiveModal,
    toastMessage,
    setToastMessage,
    showToast,
    kpiMetrics,
    datasetSource,
    updateStatus,
    overrideGroup,
    updateNote,
    deleteLead,
    addQuickLead,
    importExcel,
    exportQualified,
    resetSampleData,
    clearData,
    saveRules
  } = useLeadsManager();

  const hasLeads = totalCount > 0;

  // ─── RESIZABLE PANELS STATE ───
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [drawerWidth, setDrawerWidth] = useState(480);
  const [isMetricsCollapsed, setIsMetricsCollapsed] = useState(false);

  // Dragging refs
  const isDraggingSidebarRef = useRef(false);
  const isDraggingDrawerRef = useRef(false);
  const isDraggingVerticalRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startSidebarWRef = useRef(280);
  const startDrawerWRef = useRef(480);

  // Sidebar resize handlers
  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingSidebarRef.current = true;
    startXRef.current = e.clientX;
    startSidebarWRef.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
  };

  // Drawer resize handlers
  const handleDrawerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingDrawerRef.current = true;
    startXRef.current = e.clientX;
    startDrawerWRef.current = drawerWidth;
    document.body.style.cursor = 'col-resize';
  };

  // Horizontal divider drag (up/down) to toggle compact mode
  const handleVerticalMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVerticalRef.current = true;
    startYRef.current = e.clientY;
    document.body.style.cursor = 'row-resize';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingSidebarRef.current) {
      const delta = e.clientX - startXRef.current;
      const newW = Math.max(200, Math.min(460, startSidebarWRef.current + delta));
      setSidebarWidth(newW);
    } else if (isDraggingDrawerRef.current) {
      const delta = startXRef.current - e.clientX;
      const newW = Math.max(340, Math.min(850, startDrawerWRef.current + delta));
      setDrawerWidth(newW);
    } else if (isDraggingVerticalRef.current) {
      const deltaY = e.clientY - startYRef.current;
      if (deltaY < -25 && !isMetricsCollapsed) {
        setIsMetricsCollapsed(true);
      } else if (deltaY > 25 && isMetricsCollapsed) {
        setIsMetricsCollapsed(false);
      }
    }
  }, [isMetricsCollapsed]);

  const handleMouseUp = useCallback(() => {
    isDraggingSidebarRef.current = false;
    isDraggingDrawerRef.current = false;
    isDraggingVerticalRef.current = false;
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      {/* ─── GLOBAL APPLICATION HEADER ─── */}
      <Header
        onOpenKpiModal={() => setActiveModal('kpi')}
        onOpenBenchmarkModal={() => setActiveModal('benchmark')}
      />

      {/* ─── BODY ─── */}
      {!hasLeads ? (
        /* ─── EMPTY STATE (TRANG TRẮNG BAN ĐẦU YÊU CẦU NẠP FILE) ─── */
        <div className="flex-1 flex flex-col justify-center items-center p-6 overflow-y-auto">
          <EmptyState
            onImportExcel={importExcel}
            onLoadSample={resetSampleData}
            onShowToast={showToast}
          />
        </div>
      ) : (
        /* ─── MAIN APPLICATION SHELL KHI ĐÃ CÓ DATA ─── */
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
          {/* LEFT NAVIGATION & ACTIVE SCORING RULES */}
          <Sidebar
            activePreset={activePreset}
            onSelectPreset={applyPresetView}
            rules={rules}
            kpiMetrics={kpiMetrics}
            width={sidebarWidth}
            onOpenRulesModal={() => setActiveModal('rules')}
          />

          {/* DRAGGABLE DIVIDER: KÉO TRÁI PHẢI GIỮA SIDEBAR VÀ WORKSPACE */}
          <div
            onMouseDown={handleSidebarMouseDown}
            className="hidden lg:flex w-1.5 hover:w-2 bg-slate-200 hover:bg-[#4299e1] active:bg-[#3182ce] cursor-col-resize transition-all shrink-0 z-30 items-center justify-center group"
            title="Kéo mép trái/phải để điều chỉnh độ rộng Menu danh mục"
          >
            <div className="w-0.5 h-8 bg-slate-400 group-hover:bg-white rounded-full transition-colors" />
          </div>

          {/* MAIN OPERATIONAL WORKSPACE */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-hidden">
            {/* ─── CỐ ĐỊNH THANH ĐIỀU KHIỂN & BỘ LỌC (STICKY TOP CONTROL PANEL) ─── */}
            <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs shrink-0 select-none">
              {/* 1. WORKSPACE HEADER & PRIMARY ACTIONS */}
              <div className="px-4 lg:px-6 py-3.5 border-b border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        Bảng Sàng lọc &amp; Phân hạng Khách hàng Tiềm năng
                      </h2>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded">
                        {datasetSource}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Bóc tách thực thể hàng hải (Mặt hàng, Quy mô lô, Cảng POL/POD), chấm điểm đa chiều và sinh thuyết minh lý giải phục vụ thẩm định của Broker.
                    </p>
                  </div>

                  {/* Primary Operational Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 text-sm font-medium shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveModal('upload')}
                      className="px-3.5 py-2 bg-white border border-slate-300 rounded-md text-slate-700 hover:border-[#4299e1] hover:text-[#4299e1] active:bg-slate-100 transition cursor-pointer text-sm font-medium shadow-2xs"
                    >
                      <span>Nạp thêm tệp (.xlsx / .csv)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveModal('rules')}
                      className="px-3.5 py-2 bg-white border border-slate-300 rounded-md text-slate-700 hover:border-[#4299e1] hover:text-[#4299e1] active:bg-slate-100 transition cursor-pointer text-sm font-medium shadow-2xs"
                    >
                      <span>Cấu hình tiêu chí &amp; trọng số</span>
                    </button>
                    <button
                      type="button"
                      onClick={exportQualified}
                      className="px-4 py-2 bg-[#4299e1] hover:bg-[#3182ce] active:bg-[#2b6cb0] text-white rounded-md transition cursor-pointer font-semibold shadow-xs text-sm"
                    >
                      <span>Xuất DS đạt tiêu chí ({kpiMetrics.suitableCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={clearData}
                      title="Xóa danh sách hiện tại và quay về màn hình nạp file ban đầu"
                      className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition cursor-pointer flex items-center space-x-1 text-sm shadow-2xs"
                    >
                      <span>Quay về trang nạp</span>
                    </button>
                  </div>
                </div>

                {/* 2. COMPACT SUMMARY METRICS BAR (CÓ THỂ THU GỌN / MỞ RỘNG) */}
                {!isMetricsCollapsed && (
                  <div className="mt-2.5">
                    <MetricsBar
                      metrics={kpiMetrics}
                      onOpenKpiModal={() => setActiveModal('kpi')}
                    />
                  </div>
                )}
              </div>

              {/* 3. FILTER & ENGINE MODE BAR */}
              <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                groupFilter={groupFilter}
                onGroupFilterChange={setGroupFilter}
                serviceFilter={serviceFilter}
                onServiceFilterChange={setServiceFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onResetFilters={resetFilters}
                engineMode={engineMode}
                onEngineModeChange={setEngineMode}
              />

              {/* 4. ACTIVE MODE NOTICE BANNER */}
              <NaiveModeWarning
                engineMode={engineMode}
                onSwitchToContext={() => setEngineMode('CONTEXT_MATRIX')}
              />
            </div>

            {/* DRAGGABLE HORIZONTAL RESIZER: KÉO LÊN XUỐNG GIỮA THANH ĐIỀU KHIỂN VÀ BẢNG */}
            <div
              onMouseDown={handleVerticalMouseDown}
              className="h-2 bg-slate-100 hover:bg-[#4299e1]/20 active:bg-[#4299e1]/40 border-b border-slate-200 cursor-row-resize flex items-center justify-between px-4 transition-colors group shrink-0 select-none"
              title="Kéo lên/xuống để điều chỉnh độ cao hoặc nhấp để thu gọn/mở rộng thanh số liệu"
            >
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#4299e1]" />
                <span className="text-[11px] text-slate-400 group-hover:text-slate-700 font-medium">
                  {isMetricsCollapsed ? 'Thanh số liệu đang thu gọn' : 'Kéo lên/xuống để tùy chỉnh không gian bảng'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsMetricsCollapsed(!isMetricsCollapsed)}
                  className="text-[11px] font-semibold text-[#4299e1] hover:text-[#3182ce] underline cursor-pointer"
                >
                  {isMetricsCollapsed ? '▼ Mở rộng thẻ số liệu' : '▲ Thu gọn thẻ số liệu'}
                </button>
                <div className="w-10 h-1 bg-slate-300 group-hover:bg-[#4299e1] rounded-full transition-colors" />
              </div>
            </div>

            {/* MAIN TABLE + RIGHT INSPECTION PANEL */}
            <div className="flex-1 flex min-h-0 overflow-hidden relative">
              {/* CUSTOMER DATA TABLE CONTAINER */}
              <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
                <LeadTable
                  leads={paginatedLeads}
                  selectedLeadId={selectedLeadId}
                  onSelectLead={setSelectedLeadId}
                  onUpdateStatus={updateStatus}
                  onResetFilters={resetFilters}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onToggleSort={toggleSort}
                />

                <Pagination
                  totalLeads={totalCount}
                  filteredCount={filteredCount}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setCurrentPage}
                  onRowsPerPageChange={setRowsPerPage}
                />
              </div>

              {/* DRAGGABLE DIVIDER: KÉO TRÁI PHẢI GIỮA BẢNG VÀ DRAWER */}
              {selectedLead && (
                <div
                  onMouseDown={handleDrawerMouseDown}
                  className="w-1.5 hover:w-2 bg-slate-200 hover:bg-[#4299e1] active:bg-[#3182ce] cursor-col-resize transition-all shrink-0 z-30 flex items-center justify-center group"
                  title="Kéo mép trái để điều chỉnh độ rộng khung xem chi tiết"
                >
                  <div className="w-0.5 h-10 bg-slate-400 group-hover:bg-white rounded-full transition-colors" />
                </div>
              )}

              {/* RIGHT INSPECTION DRAWER */}
              <InspectionDrawer
                lead={selectedLead}
                rules={rules}
                width={drawerWidth}
                onClose={() => setSelectedLeadId(null)}
                onOpenOutreachModal={() => setActiveModal('outreach')}
                onUpdateStatus={updateStatus}
                onOverrideGroup={overrideGroup}
                onUpdateNote={updateNote}
                onDeleteLead={deleteLead}
              />
            </div>
          </main>
        </div>
      )}

      {/* MODALS */}
      <OutreachModal
        lead={selectedLead}
        isOpen={activeModal === 'outreach'}
        onClose={() => setActiveModal(null)}
        onShowToast={showToast}
      />

      <KpiModal
        isOpen={activeModal === 'kpi'}
        onClose={() => setActiveModal(null)}
        metrics={kpiMetrics}
      />

      <RulesModal
        isOpen={activeModal === 'rules'}
        onClose={() => setActiveModal(null)}
        rules={rules}
        onSaveRules={saveRules}
      />

      <UploadModal
        isOpen={activeModal === 'upload'}
        onClose={() => setActiveModal(null)}
        onImportExcel={importExcel}
        onAddQuickLead={addQuickLead}
        onResetSampleData={resetSampleData}
        onShowToast={showToast}
      />

      <BenchmarkModal
        isOpen={activeModal === 'benchmark'}
        onClose={() => setActiveModal(null)}
      />

      {/* TOAST NOTIFICATION */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
