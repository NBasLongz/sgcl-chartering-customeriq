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
  const navItems: { key: PresetViewType; label: string; count: number; colorClass?: string }[] = [
    { key: 'ALL', label: 'Tất cả hồ sơ khách hàng', count: kpiMetrics.total },
    { key: 'SUITABLE', label: 'Đạt tiêu chí (Nhóm A & B)', count: kpiMetrics.suitableCount, colorClass: 'text-emerald-700 font-medium' },
    { key: 'DRY_BULK', label: 'Hàng rời khô (Dry Bulk)', count: kpiMetrics.bulkCount },
    { key: 'PROJECT', label: 'Hàng dự án & Breakbulk', count: kpiMetrics.projectCount },
    { key: 'EXCLUDED', label: 'Loại trừ (Nhóm C)', count: kpiMetrics.groupCCount, colorClass: 'text-slate-400' },
    { key: 'NEEDS_REVIEW', label: 'Cần Broker kiểm tra lại', count: kpiMetrics.needsReviewCount, colorClass: 'text-amber-700 font-medium' },
  ];

  return (
    <aside className="w-full lg:w-60 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3 space-y-5">
        {/* Primary Operational Views */}
        <div>
          <div className="px-2.5 mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Danh mục Sàng lọc
            </span>
          </div>
          <nav aria-label="Bộ lọc danh mục nghiệp vụ" className="space-y-0.5 text-xs">
            {navItems.map(item => {
              const isActive = activePreset === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelectPreset(item.key)}
                  className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 transition cursor-pointer ${
                    isActive
                      ? 'font-semibold text-[#0F3D75] bg-slate-100 border-l-2 border-[#0F3D75]'
                      : 'text-slate-600 hover:bg-slate-50 border-l-2 border-transparent'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className={`font-mono tabular-nums text-[11px] ml-2 shrink-0 ${item.colorClass || 'text-slate-600'}`}>
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Reference / Out-of-scope Modules */}
        <div className="pt-3 border-t border-slate-200">
          <div className="px-2.5 mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Phân hệ khác (Tham chiếu)
            </span>
          </div>
          <div className="space-y-0.5 text-xs text-slate-400">
            <div
              className="px-2.5 py-1.5 flex items-center justify-between cursor-not-allowed"
              title="Phân hệ ngoài phạm vi đề tài sàng lọc khách hàng"
            >
              <span>Mạng lưới Chủ tàu (Owners)</span>
              <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5">Ngoài phạm vi</span>
            </div>
            <div
              className="px-2.5 py-1.5 flex items-center justify-between cursor-not-allowed"
              title="Phân hệ ngoài phạm vi đề tài sàng lọc khách hàng"
            >
              <span>Quản lý Cargo Inquiry</span>
              <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5">Ngoài phạm vi</span>
            </div>
            <div
              className="px-2.5 py-1.5 flex items-center justify-between cursor-not-allowed"
              title="Phân hệ ngoài phạm vi đề tài sàng lọc khách hàng"
            >
              <span>Hợp đồng &amp; Post-Fixture</span>
              <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5">Ngoài phạm vi</span>
            </div>
          </div>
        </div>

        {/* Active Scoring Parameters Summary */}
        <div className="pt-3 border-t border-slate-200">
          <div className="px-2.5 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Cấu hình Trọng số Hiện tại
            </span>
            <button
              type="button"
              onClick={onOpenRulesModal}
              className="text-[11px] text-[#0F3D75] hover:underline font-medium cursor-pointer"
            >
              Sửa
            </button>
          </div>
          <div className="px-2.5 space-y-2 text-[11px] text-slate-600">
            <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
              <span>Độ khớp Mặt hàng</span>
              <span className="font-mono tabular-nums font-semibold text-slate-800">
                {rules.weightCargo}%
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
              <span>Tuyến &amp; Khu vực cảng</span>
              <span className="font-mono tabular-nums font-semibold text-slate-800">
                {rules.weightRoute}%
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
              <span>Quy mô lô &amp; Cỡ tàu</span>
              <span className="font-mono tabular-nums font-semibold text-slate-800">
                {rules.weightVolume}%
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
              <span>Ngưỡng điểm Nhóm A / B</span>
              <span className="font-mono tabular-nums font-semibold text-[#0F3D75]">
                &ge;{rules.thresholdA} / &ge;{rules.thresholdB}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>Ẩn danh bảo mật (Mục 3.5.2)</span>
              <span
                className={`font-mono tabular-nums font-semibold ${
                  rules.dataMasking ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {rules.dataMasking ? 'Đang bật' : 'Tắt'}
              </span>
            </div>
            <div className="pt-1 text-[11px] text-slate-500 leading-relaxed">
              <p>
                <strong className="text-slate-700">Cỡ tàu SGCL:</strong> Small Handy &ndash; Supramax (3.000 &ndash; 55.000 DWT), tàu MPP/Project.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-slate-200 text-[11px] text-slate-400 space-y-0.5">
        <p className="font-medium text-slate-600">Công ty CP DV Tiếp vận &amp; TM Sài Gòn Cửu Long</p>
        <p>MST: 0302752341 &middot; 20/5 Tân Cảng, TP.HCM</p>
      </div>
    </aside>
  );
}
