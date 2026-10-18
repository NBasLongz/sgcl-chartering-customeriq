'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { RawLead, EvaluatedLead, PresetViewType, LeadGroup, LeadStatus } from '../types/lead';
import { ScoringRules, EngineMode, SortField, SortDirection } from '../types/rules';
import { KpiMetrics } from '../types/kpi';
import { DEFAULT_RAW_LEADS } from '../data/default-leads';
import { DEFAULT_RULES } from '../data/default-rules';
import { evaluateLead } from '../engine/scoring';
import { loadSavedLeads, saveLeadsToStorage, loadSavedRules, saveRulesToStorage } from '../engine/storage';
import { parseExcelFile, exportQualifiedLeadsToExcel } from '../engine/excel';
import { sanitizeSensitiveText } from '../engine/data-masking';

export function useLeadsManager() {
  const [rawLeads, setRawLeads] = useState<RawLead[]>(DEFAULT_RAW_LEADS);
  const [rules, setRules] = useState<ScoringRules>(DEFAULT_RULES);
  const [engineMode, setEngineMode] = useState<EngineMode>('CONTEXT_MATRIX');
  const [activePreset, setActivePreset] = useState<PresetViewType>('ALL');

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Selected Lead for Drawer & Outreach
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Active Modal: 'rules' | 'upload' | 'kpi' | 'benchmark' | 'outreach' | null
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [datasetSource, setDatasetSource] = useState<string>('Bộ dữ liệu mẫu kiểm thử (12 doanh nghiệp)');

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    const savedRules = loadSavedRules();
    const savedLeads = loadSavedLeads();
    setRules(savedRules);
    setRawLeads(savedLeads);
    setIsHydrated(true);
  }, []);

  // AI Cloud Evaluated Leads state
  const [aiEvaluatedLeads, setAiEvaluatedLeads] = useState<EvaluatedLead[] | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Recalculate evaluated leads whenever rawLeads, rules, or engineMode changes
  const evaluatedLeads = useMemo<EvaluatedLead[]>(() => {
    if (engineMode === 'CLOUD_AI' && aiEvaluatedLeads) {
      return aiEvaluatedLeads;
    }
    return rawLeads.map(lead => evaluateLead(lead, rules, engineMode));
  }, [rawLeads, rules, engineMode, aiEvaluatedLeads]);

  // Save to localStorage when hydrated & leads/rules change
  useEffect(() => {
    if (isHydrated) {
      saveLeadsToStorage(rawLeads);
      saveRulesToStorage(rules);
    }
  }, [rawLeads, rules, isHydrated]);

  // Selected evaluated lead
  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return evaluatedLeads.find(l => l.id === selectedLeadId) || null;
  }, [selectedLeadId, evaluatedLeads]);

  // Calculated KPI metrics
  const kpiMetrics = useMemo<KpiMetrics>(() => {
    const total = evaluatedLeads.length;
    const groupACount = evaluatedLeads.filter(l => l.group === 'A').length;
    const groupBCount = evaluatedLeads.filter(l => l.group === 'B').length;
    const groupCCount = evaluatedLeads.filter(l => l.group === 'C').length;
    const suitableCount = groupACount + groupBCount;

    const bulkCount = evaluatedLeads.filter(l => l.group !== 'C' && l.service === 'Dry Bulk Chartering').length;
    const projectCount = evaluatedLeads.filter(l => l.group !== 'C' && l.service === 'Project / Breakbulk').length;
    const needsReviewCount = evaluatedLeads.filter(l => l.status === 'Cần Broker kiểm tra lại').length;

    const suitablePct = total > 0 ? ((suitableCount / total) * 100).toFixed(1).replace('.', ',') : '0,0';
    const groupCPct = total > 0 ? ((groupCCount / total) * 100).toFixed(1).replace('.', ',') : '0,0';

    const manualMinutes = total * 5;
    const assistedMinutes = Math.max(1, Math.round(suitableCount * 1));
    const savedMinutes = Math.max(0, manualMinutes - assistedMinutes);
    const savedPct = manualMinutes > 0 ? ((savedMinutes / manualMinutes) * 100).toFixed(1).replace('.', ',') : '0,0';
    const hoursSaved = (savedMinutes / 60).toFixed(2).replace('.', ',');

    return {
      total,
      suitableCount,
      suitablePct,
      groupACount,
      groupBCount,
      groupCCount,
      groupCPct,
      bulkCount,
      projectCount,
      needsReviewCount,
      manualMinutes,
      assistedMinutes,
      savedMinutes,
      savedPct,
      hoursSaved
    };
  }, [evaluatedLeads]);

  // Filtered and sorted leads
  const filteredLeads = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = evaluatedLeads.filter(item => {
      const matchSearch =
        !query ||
        item.company.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.cargo.toLowerCase().includes(query) ||
        item.route.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query);

      let matchGroup = true;
      if (groupFilter === 'SUITABLE') {
        matchGroup = item.group === 'A' || item.group === 'B';
      } else if (groupFilter !== 'ALL') {
        matchGroup = item.group === groupFilter;
      }

      const matchService = serviceFilter === 'ALL' || item.service === serviceFilter;
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchSearch && matchGroup && matchService && matchStatus;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'score') {
        comparison = a.score - b.score;
      } else if (sortField === 'id') {
        comparison = a.id.localeCompare(b.id);
      } else if (sortField === 'company') {
        comparison = a.company.localeCompare(b.company, 'vi');
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [evaluatedLeads, searchQuery, groupFilter, serviceFilter, statusFilter, sortField, sortDirection]);

  // Paginated leads
  const paginatedLeads = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return filteredLeads.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredLeads, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / rowsPerPage));

  // Sorting handler
  const handleToggleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
        return field;
      } else {
        setSortDirection(field === 'score' ? 'desc' : 'asc');
        return field;
      }
    });
  }, []);

  // Preset view application
  const handleApplyPresetView = useCallback((preset: PresetViewType) => {
    setActivePreset(preset);
    setCurrentPage(1);

    if (preset === 'ALL') {
      setGroupFilter('ALL');
      setServiceFilter('ALL');
      setStatusFilter('ALL');
    } else if (preset === 'SUITABLE') {
      setGroupFilter('SUITABLE');
      setServiceFilter('ALL');
      setStatusFilter('ALL');
    } else if (preset === 'DRY_BULK') {
      setGroupFilter('SUITABLE');
      setServiceFilter('Dry Bulk Chartering');
      setStatusFilter('ALL');
    } else if (preset === 'PROJECT') {
      setGroupFilter('SUITABLE');
      setServiceFilter('Project / Breakbulk');
      setStatusFilter('ALL');
    } else if (preset === 'EXCLUDED') {
      setGroupFilter('C');
      setServiceFilter('ALL');
      setStatusFilter('ALL');
    } else if (preset === 'NEEDS_REVIEW') {
      setGroupFilter('ALL');
      setServiceFilter('ALL');
      setStatusFilter('Cần Broker kiểm tra lại');
    }
  }, []);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    handleApplyPresetView('ALL');
  }, [handleApplyPresetView]);

  // Lead CRUD actions
  const handleUpdateStatus = useCallback((id: string, newStatus: LeadStatus) => {
    setRawLeads(prev =>
      prev.map(l => (l.id === id ? { ...l, status: newStatus } : l))
    );
    showToast(`Đã cập nhật trạng thái [${id}]: ${newStatus}`);
  }, [showToast]);

  const handleOverrideGroup = useCallback((id: string, group: 'AUTO' | LeadGroup) => {
    setRawLeads(prev =>
      prev.map(l => (l.id === id ? { ...l, manualGroup: group } : l))
    );
    showToast(`Đã cập nhật phân nhóm hồ sơ [${id}]`);
  }, [showToast]);

  const handleUpdateNote = useCallback((id: string, note: string) => {
    setRawLeads(prev =>
      prev.map(l => (l.id === id ? { ...l, note } : l))
    );
  }, []);

  const handleDeleteLead = useCallback((id: string) => {
    setRawLeads(prev => {
      const target = prev.find(l => l.id === id);
      const filtered = prev.filter(l => l.id !== id);
      if (target) {
        showToast(`Đã xóa hồ sơ [${target.id}] ${target.company}`);
      }
      return filtered;
    });
    if (selectedLeadId === id) {
      setSelectedLeadId(null);
    }
  }, [selectedLeadId, showToast]);

  const handleAddQuickLead = useCallback(
    (newLead: { company: string; role: string; source: string; cargo: string; volume: string; route: string }) => {
      const sanitizedCompany = sanitizeSensitiveText(newLead.company, rules.dataMasking);
      const sanitizedCargo = sanitizeSensitiveText(newLead.cargo, rules.dataMasking);

      const nextNum = 2500 + rawLeads.length + 1;
      const leadToAdd: RawLead = {
        id: `SG-${nextNum}`,
        company: sanitizedCompany,
        role: newLead.role,
        source: newLead.source || 'Nạp trực tiếp',
        cargo: sanitizedCargo,
        volume: newLead.volume,
        route: newLead.route,
        status: 'Cần Broker kiểm tra lại',
        manualGroup: 'AUTO',
        note: ''
      };

      const evalResult = evaluateLead(leadToAdd, rules, engineMode);
      leadToAdd.status = evalResult.group === 'C' ? 'Đã loại trừ' : 'Đã duyệt tiếp cận';

      setRawLeads(prev => [leadToAdd, ...prev]);
      setSelectedLeadId(leadToAdd.id);
      setCurrentPage(1);
      setActiveModal(null);
      showToast(`Đã thêm và phân loại [${leadToAdd.company}] → Nhóm ${evalResult.group} (${evalResult.score}/100 điểm)`);
    },
    [rawLeads.length, rules, engineMode, showToast]
  );

  const handleImportExcel = useCallback(
    async (file: File, replaceExisting: boolean) => {
      const imported = await parseExcelFile(file, replaceExisting, rawLeads.length, rules.dataMasking);
      if (replaceExisting) {
        setRawLeads(imported);
      } else {
        setRawLeads(prev => [...imported, ...prev]);
      }
      setDatasetSource(`Nguồn: ${file.name} (${imported.length + (replaceExisting ? 0 : rawLeads.length)} DN)`);
      setCurrentPage(1);
      setActiveModal(null);
      showToast(`Đã nạp và chấm điểm ${imported.length} hồ sơ từ "${file.name}"`);
    },
    [rawLeads.length, rules.dataMasking, showToast]
  );

  const handleExportQualified = useCallback(() => {
    try {
      exportQualifiedLeadsToExcel(evaluatedLeads);
      showToast(`Đã xuất ${kpiMetrics.suitableCount} hồ sơ đạt tiêu chí ra file Excel`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Lỗi khi xuất file Excel');
    }
  }, [evaluatedLeads, kpiMetrics.suitableCount, showToast]);

  const handleResetSampleData = useCallback(() => {
    setRawLeads(DEFAULT_RAW_LEADS);
    setDatasetSource(`Bộ dữ liệu mẫu kiểm thử (${DEFAULT_RAW_LEADS.length} doanh nghiệp)`);
    setSelectedLeadId(null);
    setCurrentPage(1);
    setActiveModal(null);
    showToast('Đã khôi phục 12 hồ sơ khách hàng mẫu ban đầu');
  }, [showToast]);

  const handleSaveRules = useCallback((newRules: ScoringRules) => {
    setRules(newRules);
    setActiveModal(null);
    showToast('Đã áp dụng bộ trọng số mới và tính lại điểm cho toàn bộ danh sách');
  }, [showToast]);

  const handleEngineModeChange = useCallback(async (mode: EngineMode) => {
    setEngineMode(mode);
    if (mode === 'NAIVE_KEYWORD') {
      showToast('Chế độ Quét từ khóa đơn: Hồ sơ SG-2509 bị phân loại nhầm vào Nhóm A');
    } else if (mode === 'CONTEXT_MATRIX') {
      showToast('Đã bật Phân tích Ngữ cảnh Đa chiều: Loại trừ chính xác hàng LCL/đóng gói lẻ');
    } else if (mode === 'CLOUD_AI') {
      showToast('Đang kết nối Google Gemini Flash API để chấm điểm & phân tích XAI...');
      setIsLoadingAi(true);
      try {
        const res = await fetch('/api/screen-leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leads: rawLeads, rules, useGemini: true })
        });
        const data = await res.json();
        if (data.success && data.leads) {
          setAiEvaluatedLeads(data.leads);
          showToast(`Gemini AI (${data.mode === 'GEMINI_AI' ? 'Cloud API' : 'Fallback Engine'}) đã hoàn tất phân tích!`);
        } else {
          showToast('Không thể gọi Gemini API, giữ nguyên ma trận ngữ cảnh.');
        }
      } catch (err) {
        showToast('Lỗi kết nối Gemini API: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setIsLoadingAi(false);
      }
    }
  }, [rawLeads, rules, showToast]);

  return {
    leads: evaluatedLeads,
    filteredLeads,
    paginatedLeads,
    totalCount: evaluatedLeads.length,
    filteredCount: filteredLeads.length,
    totalPages,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    rules,
    engineMode,
    setEngineMode: handleEngineModeChange,
    activePreset,
    applyPresetView: handleApplyPresetView,
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
    toggleSort: handleToggleSort,
    resetFilters: handleResetFilters,
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
    updateStatus: handleUpdateStatus,
    overrideGroup: handleOverrideGroup,
    updateNote: handleUpdateNote,
    deleteLead: handleDeleteLead,
    addQuickLead: handleAddQuickLead,
    importExcel: handleImportExcel,
    exportQualified: handleExportQualified,
    resetSampleData: handleResetSampleData,
    saveRules: handleSaveRules
  };
}
