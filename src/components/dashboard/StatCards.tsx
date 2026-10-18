'use client';

import { KpiMetrics } from '@/lib/types/kpi';

interface StatCardsProps {
  metrics: KpiMetrics;
  onOpenKpi: () => void;
}

export default function StatCards({ metrics, onOpenKpi }: StatCardsProps) {
  const cards = [
    {
      label: 'Tổng hồ sơ',
      value: metrics.total,
      sub: 'doanh nghiệp',
      color: 'text-gray-900',
      bg: 'bg-white',
    },
    {
      label: 'Nhóm A — Mục tiêu',
      value: metrics.groupACount,
      sub: 'ưu tiên tiếp cận ngay',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-100',
      badge: 'A',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      label: 'Nhóm B — Tiềm năng',
      value: metrics.groupBCount,
      sub: 'theo dõi Laycan',
      color: 'text-amber-700',
      bg: 'bg-amber-50 border-amber-100',
      badge: 'B',
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      label: 'Nhóm C — Loại trừ',
      value: metrics.groupCCount,
      sub: `${metrics.groupCPct}% tự động lọc`,
      color: 'text-gray-500',
      bg: 'bg-gray-50 border-gray-100',
    },
    {
      label: 'Giờ công tiết kiệm',
      value: `~${metrics.hoursSaved}h`,
      sub: `tiết kiệm ${metrics.savedPct}%`,
      color: 'text-[#0F3D75]',
      bg: 'bg-blue-50 border-blue-100',
      clickable: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
      {cards.map((c) => (
        <div
          key={c.label}
          onClick={c.clickable ? onOpenKpi : undefined}
          className={`${c.bg} border rounded-xl px-4 py-3.5 ${c.clickable ? 'cursor-pointer hover:shadow-sm' : ''} transition`}
        >
          <p className="text-xs text-gray-500 font-medium mb-1 flex items-center space-x-1.5">
            {c.badge && (
              <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md ${c.badgeColor}`}>
                {c.badge}
              </span>
            )}
            <span>{c.label}</span>
          </p>
          <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
