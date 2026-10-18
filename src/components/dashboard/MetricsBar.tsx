'use client';

import { KpiMetrics } from '@/lib/types/kpi';

interface MetricsBarProps {
  metrics: KpiMetrics;
  onOpenKpiModal: () => void;
}

export default function MetricsBar({ metrics, onOpenKpiModal }: MetricsBarProps) {
  return (
    <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
      <div>
        <span className="text-[11px] text-slate-500 block">Tổng hồ sơ đang nạp</span>
        <div className="mt-0.5 flex items-baseline space-x-1.5">
          <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
            {metrics.total}
          </span>
          <span className="text-[11px] text-slate-400">doanh nghiệp</span>
        </div>
      </div>

      <div className="border-l border-slate-200 pl-3">
        <span className="text-[11px] text-slate-500 block">Đạt tiêu chí (Nhóm A + B)</span>
        <div className="mt-0.5 flex items-baseline space-x-1.5">
          <span className="text-lg font-bold font-mono tabular-nums text-emerald-700">
            {metrics.suitableCount}
          </span>
          <span className="text-[11px] font-mono tabular-nums text-slate-500">
            ({metrics.suitablePct}%)
          </span>
        </div>
      </div>

      <div className="border-l border-slate-200 pl-3">
        <span className="text-[11px] text-slate-500 block">Nhóm A (Mục tiêu cốt lõi)</span>
        <div className="mt-0.5 flex items-baseline space-x-1.5">
          <span className="text-lg font-bold font-mono tabular-nums text-[#0F3D75]">
            {metrics.groupACount}
          </span>
          <span className="text-[11px] text-slate-400">ưu tiên tiếp cận</span>
        </div>
      </div>

      <div className="border-l border-slate-200 pl-3">
        <span className="text-[11px] text-slate-500 block">Nhóm B (Tiềm năng theo dõi)</span>
        <div className="mt-0.5 flex items-baseline space-x-1.5">
          <span className="text-lg font-bold font-mono tabular-nums text-amber-700">
            {metrics.groupBCount}
          </span>
          <span className="text-[11px] text-slate-400">theo dõi Laycan</span>
        </div>
      </div>

      <div className="border-l border-slate-200 pl-3">
        <span className="text-[11px] text-slate-500 block">Nhóm C (Loại trừ tự động)</span>
        <div className="mt-0.5 flex items-baseline space-x-1.5">
          <span className="text-lg font-bold font-mono tabular-nums text-slate-500">
            {metrics.groupCCount}
          </span>
          <span className="text-[11px] font-mono tabular-nums text-slate-400">
            ({metrics.groupCPct}%)
          </span>
        </div>
      </div>

      <div className="border-l border-slate-200 pl-3">
        <span className="text-[11px] text-slate-500 block">Thời gian lọc tiết kiệm (Ước tính)</span>
        <div className="mt-0.5 flex items-baseline space-x-1.5">
          <span className="text-lg font-bold font-mono tabular-nums text-[#0F3D75]">
            ~{metrics.savedMinutes}
          </span>
          <span className="text-[11px] text-slate-500">
            phút (
            <button
              type="button"
              onClick={onOpenKpiModal}
              className="text-[#0F3D75] underline hover:text-[#0A2B54] cursor-pointer"
            >
              Chi tiết
            </button>
            )
          </span>
        </div>
      </div>
    </div>
  );
}
