'use client';

import { useLeadsManager } from '@/lib/hooks/useLeadsManager';
import AppHeader from '@/components/layout/AppHeader';
import EmptyState from '@/components/dashboard/EmptyState';
import StatCards from '@/components/dashboard/StatCards';
import Toolbar from '@/components/dashboard/Toolbar';
import LeadTableV2 from '@/components/dashboard/LeadTableV2';
import Pagination from '@/components/dashboard/Pagination';
import DrawerV2 from '@/components/inspection/DrawerV2';
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
    isLoadingAi,
    searchQuery,
    setSearchQuery,
    groupFilter,
    setGroupFilter,
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
    updateStatus,
    overrideGroup,
    updateNote,
    deleteLead,
    addQuickLead,
    importExcel,
    exportQualified,
    resetSampleData,
    clearData,
    saveRules,
  } = useLeadsManager();

  const hasLeads = totalCount > 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* HEADER — always visible */}
      <AppHeader
        totalLeads={totalCount}
        suitableCount={kpiMetrics.suitableCount}
        onOpenKpi={() => setActiveModal('kpi')}
        onOpenUpload={() => setActiveModal('upload')}
        onExport={exportQualified}
        onReset={clearData}
      />

      {/* BODY */}
      {!hasLeads ? (
        /* ─── EMPTY STATE ─── */
        <EmptyState
          onImportExcel={importExcel}
          onLoadSample={resetSampleData}
          onShowToast={showToast}
        />
      ) : (
        /* ─── MAIN DASHBOARD ─── */
        <div className="flex-1 flex overflow-hidden">

          {/* LEFT: Main content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Stat Cards */}
            <div className="px-5 pt-4 pb-0 bg-white border-b border-gray-200">
              <StatCards metrics={kpiMetrics} onOpenKpi={() => setActiveModal('kpi')} />
            </div>

            {/* Toolbar: Search + Filter + Engine */}
            <Toolbar
              totalLeads={totalCount}
              filteredCount={filteredCount}
              searchQuery={searchQuery}
              onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              groupFilter={groupFilter}
              onGroupFilterChange={(g) => { setGroupFilter(g); setCurrentPage(1); }}
              engineMode={engineMode}
              onEngineModeChange={setEngineMode}
              onResetFilters={resetFilters}
              isLoadingAi={isLoadingAi}
            />

            {/* Table */}
            <div className="flex-1 bg-white overflow-hidden flex flex-col">
              <LeadTableV2
                leads={paginatedLeads}
                selectedLeadId={selectedLeadId}
                onSelectLead={setSelectedLeadId}
                onUpdateStatus={updateStatus}
                onResetFilters={resetFilters}
                sortField={sortField}
                sortDirection={sortDirection}
                onToggleSort={toggleSort}
              />

              {/* Pagination */}
              <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-white text-sm">
                <span className="text-gray-400 text-sm">
                  Hiển thị <strong className="text-gray-700">{Math.min((currentPage - 1) * rowsPerPage + 1, filteredCount)}–{Math.min(currentPage * rowsPerPage, filteredCount)}</strong> trong <strong className="text-gray-700">{filteredCount}</strong> kết quả
                </span>
                <Pagination
                  totalLeads={totalCount}
                  filteredCount={filteredCount}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setCurrentPage}
                  onRowsPerPageChange={(r) => { setRowsPerPage(r); setCurrentPage(1); }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Inspection Drawer */}
          {selectedLead && (
            <DrawerV2
              lead={selectedLead}
              rules={rules}
              onClose={() => setSelectedLeadId(null)}
              onOpenOutreach={() => setActiveModal('outreach')}
              onUpdateStatus={updateStatus}
              onOverrideGroup={overrideGroup}
              onUpdateNote={updateNote}
              onDeleteLead={deleteLead}
            />
          )}
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

      {/* TOAST */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
