'use client';

import { KpiMetrics } from '@/lib/types/kpi';

interface MetricsBarProps {
  metrics: KpiMetrics;
  onOpenKpiModal: () => void;
}

export default function MetricsBar({ metrics, onOpenKpiModal }: MetricsBarProps) {
  return (
    <div className="mt-3.5 pt-3.5 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
        <span className="text-xs text-slate-600 font-semibold block">Tổng hồ sơ nạp</span>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {metrics.total}
          </span>
          <span className="text-xs text-slate-500">hồ sơ</span>
        </div>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-lg p-3">
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

      <div className="bg-blue-50/50 border border-blue-200/80 rounded-lg p-3">
        <span className="text-xs text-blue-900 font-semibold block">Nhóm A (Cốt lõi)</span>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-[#0F3D75]">
            {metrics.groupACount}
          </span>
          <span className="text-xs text-slate-500 font-medium">ưu tiên tiếp cận</span>
        </div>
      </div>

      <div className="bg-amber-50/50 border border-amber-200/80 rounded-lg p-3">
        <span className="text-xs text-amber-900 font-semibold block">Nhóm B (Tiềm năng)</span>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-amber-800">
            {metrics.groupBCount}
          </span>
          <span className="text-xs text-slate-500 font-medium">theo dõi Laycan</span>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
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

      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
        <span className="text-xs text-slate-600 font-semibold block">Thời gian tiết kiệm</span>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-[#0F3D75]">
            ~{metrics.savedMinutes}
          </span>
          <span className="text-xs text-slate-500">
            phút{' '}
            <button
              type="button"
              onClick={onOpenKpiModal}
              className="text-[#0F3D75] hover:text-[#0A2B54] underline font-semibold cursor-pointer"
            >
              (KPIs)
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
