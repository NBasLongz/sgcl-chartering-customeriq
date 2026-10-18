'use client';

import { KpiMetrics } from '@/lib/types/kpi';

interface MetricsBarProps {
  metrics: KpiMetrics;
  onOpenKpiModal: () => void;
  groupFilter?: string;
  onGroupFilterChange?: (group: string) => void;
  compact?: boolean;
}

export default function MetricsBar({
  metrics,
  onOpenKpiModal,
  groupFilter = 'ALL',
  onGroupFilterChange
}: MetricsBarProps) {
  // Safe percentages for distribution bar
  const total = metrics.total || 1;
  const pctA = Math.round((metrics.groupACount / total) * 100);
  const pctB = Math.round((metrics.groupBCount / total) * 100);
  const pctC = Math.max(0, 100 - pctA - pctB);

  // SVG mini-donut parameters (r = 15, circumference = 2 * PI * 15 ≈ 94.25)
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, metrics.suitablePct)) / 100) * circumference;

  return (
    <div className="bg-white border border-slate-200/90 rounded-lg px-3.5 py-1.5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs select-none">
      {/* 1. MINI DONUT CHART: TỶ LỆ ĐẠT TIÊU CHÍ (A + B) */}
      <div
        onClick={() => onGroupFilterChange?.(groupFilter === 'SUITABLE' ? 'ALL' : 'SUITABLE')}
        title="Nhấp để lọc danh sách khách hàng Đạt tiêu chí (A + B)"
        className={`flex items-center space-x-2.5 px-2.5 py-1 rounded-md border transition cursor-pointer shrink-0 ${
          groupFilter === 'SUITABLE'
            ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400 shadow-2xs'
            : 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300'
        }`}
      >
        <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
          <svg className="w-9 h-9 -rotate-90 transform" viewBox="0 0 38 38">
            <circle
              cx="19"
              cy="19"
              r={radius}
              className="stroke-slate-200"
              strokeWidth="3.5"
              fill="transparent"
            />
            <circle
              cx="19"
              cy="19"
              r={radius}
              className="stroke-emerald-500 transition-all duration-500 ease-out"
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-[10px] font-mono font-bold text-emerald-800">
            {metrics.suitablePct}%
          </span>
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
              Đạt tiêu chí (A+B)
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-xs font-mono text-emerald-700">
            <strong className="text-sm font-bold">{metrics.suitableCount}</strong> / {metrics.total} hồ sơ
          </div>
        </div>
      </div>

      {/* 2. STACKED DISTRIBUTION BAR: TỶ LỆ PHÂN BỔ NHÓM A - B - C */}
      <div className="flex-1 min-w-[280px] max-w-2xl px-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
          <span className="flex items-center space-x-1">
            <span>Biểu đồ Phân bổ Nhóm Khách hàng</span>
            <span className="text-[10px] text-slate-400 font-normal">(Nhấp từng màu để lọc)</span>
          </span>
          <span className="text-slate-400 font-mono text-[10px]">Tổng {metrics.total} DN (100%)</span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full flex overflow-hidden p-0.5 border border-slate-200 shadow-inner">
          {/* Group A segment */}
          {metrics.groupACount > 0 && (
            <div
              onClick={() => onGroupFilterChange?.(groupFilter === 'A' ? 'ALL' : 'A')}
              style={{ width: `${Math.max(pctA, 4)}%` }}
              title={`Nhóm A (Mục tiêu cốt lõi): ${metrics.groupACount} hồ sơ (${metrics.groupAPct}%) - Bấm để lọc`}
              className="h-full bg-[#4299e1] hover:brightness-110 transition-all cursor-pointer rounded-l-full"
            />
          )}
          {/* Group B segment */}
          {metrics.groupBCount > 0 && (
            <div
              onClick={() => onGroupFilterChange?.(groupFilter === 'B' ? 'ALL' : 'B')}
              style={{ width: `${Math.max(pctB, 4)}%` }}
              title={`Nhóm B (Tiềm năng theo dõi): ${metrics.groupBCount} hồ sơ (${metrics.groupBPct}%) - Bấm để lọc`}
              className={`h-full bg-amber-400 hover:brightness-110 transition-all cursor-pointer ${
                metrics.groupACount === 0 ? 'rounded-l-full' : ''
              } ${metrics.groupCCount === 0 ? 'rounded-r-full' : ''}`}
            />
          )}
          {/* Group C segment */}
          {metrics.groupCCount > 0 && (
            <div
              onClick={() => onGroupFilterChange?.(groupFilter === 'C' ? 'ALL' : 'C')}
              style={{ width: `${pctC}%` }}
              title={`Nhóm C (Loại trừ): ${metrics.groupCCount} hồ sơ (${metrics.groupCPct}%) - Bấm để lọc`}
              className="h-full bg-slate-300 hover:brightness-95 transition-all cursor-pointer rounded-r-full"
            />
          )}
        </div>

        {/* Interactive Legend Buttons */}
        <div className="flex items-center justify-between text-[11px] mt-1 flex-wrap gap-1">
          <button
            type="button"
            onClick={() => onGroupFilterChange?.(groupFilter === 'A' ? 'ALL' : 'A')}
            className={`flex items-center space-x-1 px-1.5 py-0.5 rounded cursor-pointer transition ${
              groupFilter === 'A'
                ? 'bg-blue-100 font-bold text-[#2b6cb0] ring-1 ring-[#4299e1]'
                : 'text-slate-600 hover:text-[#4299e1]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4299e1] shrink-0" />
            <span>Nhóm A (Cốt lõi):</span>
            <span className="font-mono font-bold text-[#4299e1]">{metrics.groupACount}</span>
            <span className="text-[10px] text-slate-400">({metrics.groupAPct}%)</span>
          </button>

          <button
            type="button"
            onClick={() => onGroupFilterChange?.(groupFilter === 'B' ? 'ALL' : 'B')}
            className={`flex items-center space-x-1 px-1.5 py-0.5 rounded cursor-pointer transition ${
              groupFilter === 'B'
                ? 'bg-amber-100 font-bold text-amber-900 ring-1 ring-amber-400'
                : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span>Nhóm B (Tiềm năng):</span>
            <span className="font-mono font-bold text-amber-800">{metrics.groupBCount}</span>
            <span className="text-[10px] text-slate-400">({metrics.groupBPct}%)</span>
          </button>

          <button
            type="button"
            onClick={() => onGroupFilterChange?.(groupFilter === 'C' ? 'ALL' : 'C')}
            className={`flex items-center space-x-1 px-1.5 py-0.5 rounded cursor-pointer transition ${
              groupFilter === 'C'
                ? 'bg-slate-200 font-bold text-slate-800 ring-1 ring-slate-400'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
            <span>Nhóm C (Loại trừ):</span>
            <span className="font-mono font-bold text-slate-600">{metrics.groupCCount}</span>
            <span className="text-[10px] text-slate-400">({metrics.groupCPct}%)</span>
          </button>
        </div>
      </div>

      {/* 3. BROKER PRODUCTIVITY & KPIS LINK */}
      <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1 flex items-center justify-between space-x-3 shrink-0">
        <div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">
            Tiết kiệm Broker
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-sm font-bold font-mono text-[#4299e1]">~{metrics.savedMinutes}</span>
            <span className="text-[11px] text-slate-500">phút</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenKpiModal}
          className="text-xs font-bold text-[#4299e1] hover:text-[#3182ce] bg-white border border-[#4299e1]/40 hover:border-[#4299e1] rounded px-2 py-1 shadow-2xs transition cursor-pointer flex items-center space-x-0.5"
          title="Mở Báo cáo Chi tiết & Biểu đồ Đo lường ROI/KPIs"
        >
          <span>Biểu đồ KPIs</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
