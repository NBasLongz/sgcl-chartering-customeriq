'use client';

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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* APPLICATION HEADER */}
      <Header
        onOpenKpiModal={() => setActiveModal('kpi')}
        onOpenBenchmarkModal={() => setActiveModal('benchmark')}
      />

      {/* BODY */}
      {!hasLeads ? (
        /* ─── EMPTY STATE (TRANG TRẮNG BAN ĐẦU YÊU CẦU NẠP FILE) ─── */
        <div className="flex-1 flex flex-col justify-center items-center p-6">
          <EmptyState
            onImportExcel={importExcel}
            onLoadSample={resetSampleData}
            onShowToast={showToast}
          />
        </div>
      ) : (
        /* ─── MAIN APPLICATION SHELL KHI ĐÃ CÓ DATA ─── */
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* LEFT NAVIGATION & ACTIVE SCORING RULES */}
          <Sidebar
            activePreset={activePreset}
            onSelectPreset={applyPresetView}
            rules={rules}
            kpiMetrics={kpiMetrics}
            onOpenRulesModal={() => setActiveModal('rules')}
          />

          {/* MAIN OPERATIONAL WORKSPACE */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
            {/* WORKSPACE HEADER & PRIMARY ACTIONS */}
            <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-slate-900">
                      Bảng Sàng lọc &amp; Phân hạng Khách hàng Tiềm năng
                    </h2>
                    <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200">
                      {datasetSource}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bóc tách thực thể hàng hải (Mặt hàng, Quy mô lô, Cảng POL/POD), chấm điểm đa chiều và sinh thuyết minh lý giải phục vụ thẩm định của Broker.
                  </p>
                </div>

                {/* Primary Operational Actions */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveModal('upload')}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                  >
                    <span>Nạp thêm tệp (.xlsx / .csv)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal('rules')}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                  >
                    <span>Cấu hình tiêu chí &amp; trọng số</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportQualified}
                    className="px-3.5 py-1.5 bg-[#0F3D75] text-white hover:bg-[#0A2B54] rounded-md transition cursor-pointer font-semibold shadow-xs"
                  >
                    <span>Xuất DS đạt tiêu chí ({kpiMetrics.suitableCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearData}
                    title="Xóa danh sách hiện tại và quay về màn hình nạp file ban đầu"
                    className="px-2.5 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition cursor-pointer flex items-center space-x-1"
                  >
                    <span>Quay về trang nạp</span>
                  </button>
                </div>
              </div>

              {/* COMPACT SUMMARY METRICS BAR */}
              <MetricsBar
                metrics={kpiMetrics}
                onOpenKpiModal={() => setActiveModal('kpi')}
              />
            </div>

            {/* FILTER & ENGINE MODE BAR */}
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

            {/* ACTIVE MODE NOTICE BANNER */}
            <NaiveModeWarning
              engineMode={engineMode}
              onSwitchToContext={() => setEngineMode('CONTEXT_MATRIX')}
            />

            {/* MAIN TABLE + RIGHT INSPECTION PANEL */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
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

              {/* RIGHT INSPECTION DRAWER */}
              <InspectionDrawer
                lead={selectedLead}
                rules={rules}
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
