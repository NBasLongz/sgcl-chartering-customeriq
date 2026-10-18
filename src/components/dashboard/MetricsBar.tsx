'use client';

import { KpiMetrics } from '@/lib/types/kpi';

interface MetricsBarProps {
  metrics: KpiMetrics;
  onOpenKpiModal: () => void;
  compact?: boolean;
}

export default function MetricsBar({ metrics, onOpenKpiModal }: MetricsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {/* 1. Tổng hồ sơ nạp */}
      <div className="bg-white border border-slate-200/90 rounded-md px-3 py-1.5 shadow-2xs hover:border-[#4299e1]/50 transition flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">Tổng hồ sơ</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold font-mono text-slate-900">{metrics.total}</span>
            <span className="text-xs text-slate-500">hồ sơ</span>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">100%</span>
      </div>

      {/* 2. Đạt tiêu chí (A + B) */}
      <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-md px-3 py-1.5 shadow-2xs hover:border-emerald-300 transition flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-emerald-800 block uppercase tracking-wider">Đạt tiêu chí (A+B)</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold font-mono text-emerald-700">{metrics.suitableCount}</span>
            <span className="text-xs font-mono font-bold text-emerald-700">({metrics.suitablePct}%)</span>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
      </div>

      {/* 3. Nhóm A (Cốt lõi) */}
      <div className="bg-blue-50/50 border border-blue-200/80 rounded-md px-3 py-1.5 shadow-2xs hover:border-[#4299e1] transition flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#2b6cb0] block uppercase tracking-wider">Nhóm A (Cốt lõi)</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold font-mono text-[#4299e1]">{metrics.groupACount}</span>
            <span className="text-xs text-slate-500">tiếp cận</span>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#4299e1] shrink-0" />
      </div>

      {/* 4. Nhóm B (Tiềm năng) */}
      <div className="bg-amber-50/50 border border-amber-200/80 rounded-md px-3 py-1.5 shadow-2xs hover:border-amber-300 transition flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-amber-900 block uppercase tracking-wider">Nhóm B (Tiềm năng)</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold font-mono text-amber-800">{metrics.groupBCount}</span>
            <span className="text-xs text-slate-500">theo dõi</span>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
      </div>

      {/* 5. Nhóm C (Loại trừ) */}
      <div className="bg-white border border-slate-200/90 rounded-md px-3 py-1.5 shadow-2xs hover:border-slate-300 transition flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">Nhóm C (Loại trừ)</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold font-mono text-slate-600">{metrics.groupCCount}</span>
            <span className="text-xs font-mono text-slate-500">({metrics.groupCPct}%)</span>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
      </div>

      {/* 6. Thời gian tiết kiệm */}
      <div className="bg-white border border-slate-200/90 rounded-md px-3 py-1.5 shadow-2xs hover:border-[#4299e1]/50 transition flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">Tiết kiệm Broker</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold font-mono text-[#4299e1]">~{metrics.savedMinutes}</span>
            <span className="text-xs text-slate-500">phút</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenKpiModal}
          className="text-xs font-bold text-[#4299e1] hover:text-[#3182ce] underline cursor-pointer ml-1"
          title="Xem báo cáo đo lường chi tiết"
        >
          KPIs &rarr;
        </button>
      </div>
    </div>
  );
}
