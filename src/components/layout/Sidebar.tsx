'use client';

import { PresetViewType } from '@/lib/types/lead';
import { ScoringRules } from '@/lib/types/rules';
import { KpiMetrics } from '@/lib/types/kpi';

interface SidebarProps {
  activePreset: PresetViewType;
  onSelectPreset: (preset: PresetViewType) => void;
  rules: ScoringRules;
  kpiMetrics: KpiMetrics;
  onOpenRulesModal: () => void;
}

export default function Sidebar({
  activePreset,
  onSelectPreset,
  rules,
  kpiMetrics,
  onOpenRulesModal
}: SidebarProps) {
  const navItems: {
    key: PresetViewType;
    label: string;
    count: number;
    icon: string;
    badgeClass: string;
  }[] = [
    {
      key: 'ALL',
      label: 'Tất cả hồ sơ',
      count: kpiMetrics.total,
      icon: '📋',
      badgeClass: 'bg-slate-100 text-slate-700'
    },
    {
      key: 'SUITABLE',
      label: 'Đạt tiêu chí (A & B)',
      count: kpiMetrics.suitableCount,
      icon: '⭐',
      badgeClass: 'bg-emerald-100 text-emerald-800 font-bold'
    },
    {
      key: 'DRY_BULK',
      label: 'Hàng rời khô (Bulk)',
      count: kpiMetrics.bulkCount,
      icon: '⚓',
      badgeClass: 'bg-blue-50 text-blue-800'
    },
    {
      key: 'PROJECT',
      label: 'Hàng dự án & MPP',
      count: kpiMetrics.projectCount,
      icon: '🏗️',
      badgeClass: 'bg-indigo-50 text-indigo-800'
    },
    {
      key: 'EXCLUDED',
      label: 'Loại trừ (Nhóm C)',
      count: kpiMetrics.groupCCount,
      icon: '🚫',
      badgeClass: 'bg-slate-100 text-slate-400'
    },
    {
      key: 'NEEDS_REVIEW',
      label: 'Cần kiểm tra lại',
      count: kpiMetrics.needsReviewCount,
      icon: '⚠️',
      badgeClass: 'bg-amber-100 text-amber-800 font-bold'
    },
  ];

  return (
    <aside className="w-full lg:w-[270px] bg-white border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-5">
        {/* Primary Operational Views */}
        <div>
          <div className="px-1 mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Danh mục sàng lọc
            </span>
          </div>
          <nav aria-label="Bộ lọc danh mục nghiệp vụ" className="space-y-1">
            {navItems.map(item => {
              const isActive = activePreset === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelectPreset(item.key)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] transition-all cursor-pointer ${
                    isActive
                      ? 'font-semibold text-[#0F3D75] bg-blue-50/90 shadow-xs ring-1 ring-blue-100'
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-mono font-medium shrink-0 ${item.badgeClass}`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Scoring Parameters Card - Soft Rounded Modern Design */}
        <div className="bg-slate-50/90 border border-slate-200/70 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-700">Cấu hình trọng số</span>
            </div>
            <button
              type="button"
              onClick={onOpenRulesModal}
              className="text-xs text-[#0F3D75] hover:text-[#0A2B54] font-bold hover:underline cursor-pointer px-2 py-0.5 rounded-md hover:bg-blue-100/50 transition"
            >
              Chỉnh sửa
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
              <span>Độ khớp Mặt hàng</span>
              <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200/60">
                {rules.weightCargo}%
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
              <span>Tuyến &amp; Cảng POL/POD</span>
              <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200/60">
                {rules.weightRoute}%
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
              <span>Quy mô lô &amp; Cỡ tàu</span>
              <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200/60">
                {rules.weightVolume}%
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
              <span>Ngưỡng Nhóm A / B</span>
              <span className="font-mono font-bold text-[#0F3D75] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                &ge;{rules.thresholdA} / &ge;{rules.thresholdB}
              </span>
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <span>Ẩn danh bảo mật (Mục 3.5.2)</span>
              <span
                className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${
                  rules.dataMasking
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {rules.dataMasking ? 'Đang bật' : 'Tắt'}
              </span>
            </div>
          </div>

          <div className="pt-1 border-t border-slate-200/60 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-medium text-slate-700">Dải tàu SGCL:</span> 3.000 &ndash; 55.000 DWT (Handy / Supramax / MPP có cẩu).
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200/70 text-xs text-slate-400 space-y-1">
        <p className="font-medium text-slate-700 text-[12px]">Saigon Cuulong JSC (SGCL)</p>
        <p className="text-[11px] text-slate-500">MST: 0302752341 &middot; 20/5 Tân Cảng, TP.HCM</p>
      </div>
    </aside>
  );
}
