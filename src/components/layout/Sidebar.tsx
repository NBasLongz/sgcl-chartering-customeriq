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
    dotClass: string;
    badgeClass: string;
  }[] = [
    {
      key: 'ALL',
      label: 'Tất cả hồ sơ',
      count: kpiMetrics.total,
      dotClass: 'bg-slate-400',
      badgeClass: 'bg-slate-100 text-slate-700'
    },
    {
      key: 'SUITABLE',
      label: 'Đạt tiêu chí (Nhóm A & B)',
      count: kpiMetrics.suitableCount,
      dotClass: 'bg-emerald-600',
      badgeClass: 'bg-emerald-50 text-emerald-800 font-semibold'
    },
    {
      key: 'DRY_BULK',
      label: 'Hàng rời khô (Dry Bulk)',
      count: kpiMetrics.bulkCount,
      dotClass: 'bg-blue-600',
      badgeClass: 'bg-blue-50 text-blue-800'
    },
    {
      key: 'PROJECT',
      label: 'Hàng dự án & Breakbulk',
      count: kpiMetrics.projectCount,
      dotClass: 'bg-indigo-600',
      badgeClass: 'bg-indigo-50 text-indigo-800'
    },
    {
      key: 'EXCLUDED',
      label: 'Loại trừ (Nhóm C)',
      count: kpiMetrics.groupCCount,
      dotClass: 'bg-slate-300',
      badgeClass: 'bg-slate-100 text-slate-400'
    },
    {
      key: 'NEEDS_REVIEW',
      label: 'Cần Broker kiểm tra lại',
      count: kpiMetrics.needsReviewCount,
      dotClass: 'bg-amber-500',
      badgeClass: 'bg-amber-50 text-amber-800 font-semibold'
    },
  ];

  return (
    <aside className="w-full lg:w-[270px] bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3.5 space-y-4">
        {/* Navigation Categories */}
        <div>
          <div className="px-1.5 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Danh mục sàng lọc
            </span>
          </div>
          <nav aria-label="Bộ lọc danh mục nghiệp vụ" className="space-y-0.5">
            {navItems.map(item => {
              const isActive = activePreset === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelectPreset(item.key)}
                  className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] transition cursor-pointer ${
                    isActive
                      ? 'font-semibold text-[#0F3D75] bg-blue-50/80 shadow-2xs border border-blue-100'
                      : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.dotClass}`}></span>
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

        {/* Active Scoring Parameters Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide text-[11px]">
              Cấu hình trọng số
            </span>
            <button
              type="button"
              onClick={onOpenRulesModal}
              className="text-xs text-[#0F3D75] hover:text-[#0A2B54] font-semibold hover:underline cursor-pointer"
            >
              Chỉnh sửa
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
              <span>Độ khớp Mặt hàng</span>
              <span className="font-mono font-bold text-slate-800">
                {rules.weightCargo}%
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
              <span>Tuyến &amp; Cảng POL/POD</span>
              <span className="font-mono font-bold text-slate-800">
                {rules.weightRoute}%
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
              <span>Quy mô lô &amp; Cỡ tàu</span>
              <span className="font-mono font-bold text-slate-800">
                {rules.weightVolume}%
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
              <span>Ngưỡng Nhóm A / B</span>
              <span className="font-mono font-bold text-[#0F3D75]">
                &ge;{rules.thresholdA} / &ge;{rules.thresholdB}
              </span>
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <span>Mã hóa bảo mật thông tin</span>
              <span
                className={`font-semibold text-xs ${
                  rules.dataMasking ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {rules.dataMasking ? 'Đang bật' : 'Tắt'}
              </span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-200/60 text-xs text-slate-500 leading-snug">
            <strong className="text-slate-700">Đội tàu SGCL:</strong> 3.000 &ndash; 55.000 DWT (Handy &ndash; Supramax, tàu MPP có cẩu).
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3.5 border-t border-slate-200 text-xs text-slate-400 space-y-0.5">
        <p className="font-semibold text-slate-700 text-[11px]">Saigon Cuulong JSC (SGCL)</p>
        <p className="text-[11px]">MST: 0302752341 &middot; 20/5 Tân Cảng, TP.HCM</p>
      </div>
    </aside>
  );
}
