'use client';

import { KpiMetrics } from '@/lib/types/kpi';

interface MetricsBarProps {
  metrics: KpiMetrics;
  onOpenKpiModal: () => void;
  compact?: boolean;
}

export default function MetricsBar({ metrics, onOpenKpiModal, compact = false }: MetricsBarProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 transition-all ${compact ? 'py-1' : 'pt-2'}`}>
      <div className="bg-white border border-slate-200/90 rounded-lg p-3 shadow-2xs hover:border-[#4299e1]/50 transition">
        <span className="text-xs text-slate-600 font-semibold block">Tổng hồ sơ nạp</span>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {metrics.total}
          </span>
          <span className="text-xs text-slate-500">hồ sơ</span>
        </div>
      </div>

      <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-lg p-3 shadow-2xs hover:border-emerald-300 transition">
        <span className="text-xs text-emerald-900 font-semibold block">Đạt tiêu chí (A + B)</span>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {metrics.suitableCount}
          </span>
          <span className="text-xs font-mono font-bold text-emerald-700">
            ({metrics.suitablePct}%)
          </span>
        </div>
      </div>

      <div className="bg-blue-50/40 border border-blue-200/80 rounded-lg p-3 shadow-2xs hover:border-[#4299e1] transition">
        <span className="text-xs text-[#2b6cb0] font-semibold block">Nhóm A (Cốt lõi)</span>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-[#4299e1]">
            {metrics.groupACount}
          </span>
          <span className="text-xs text-slate-500 font-medium">ưu tiên tiếp cận</span>
        </div>
      </div>

      <div className="bg-amber-50/40 border border-amber-200/80 rounded-lg p-3 shadow-2xs hover:border-amber-300 transition">
        <span className="text-xs text-amber-900 font-semibold block">Nhóm B (Tiềm năng)</span>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-amber-800">
            {metrics.groupBCount}
          </span>
          <span className="text-xs text-slate-500 font-medium">theo dõi Laycan</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-lg p-3 shadow-2xs hover:border-slate-300 transition">
        <span className="text-xs text-slate-600 font-semibold block">Nhóm C (Loại trừ)</span>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-600">
            {metrics.groupCCount}
          </span>
          <span className="text-xs font-mono text-slate-500">
            ({metrics.groupCPct}%)
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-lg p-3 shadow-2xs hover:border-[#4299e1]/50 transition">
        <span className="text-xs text-slate-600 font-semibold block">Thời gian tiết kiệm</span>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-[#4299e1]">
            ~{metrics.savedMinutes}
          </span>
          <span className="text-xs text-slate-500">
            phút{' '}
            <button
              type="button"
              onClick={onOpenKpiModal}
              className="text-[#4299e1] hover:text-[#3182ce] underline font-semibold cursor-pointer"
            >
              (KPIs)
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
