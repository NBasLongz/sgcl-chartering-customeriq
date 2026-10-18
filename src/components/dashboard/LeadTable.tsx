'use client';

import { EvaluatedLead, LeadStatus } from '@/lib/types/lead';
import { SortField, SortDirection } from '@/lib/types/rules';

interface LeadTableProps {
  leads: EvaluatedLead[];
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  onResetFilters: () => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onToggleSort: (field: SortField) => void;
}

export default function LeadTable({
  leads,
  selectedLeadId,
  onSelectLead,
  onUpdateStatus,
  onResetFilters,
  sortField,
  sortDirection,
  onToggleSort
}: LeadTableProps) {
  const statuses: LeadStatus[] = [
    'Đã duyệt tiếp cận',
    'Giao Senior Broker',
    'Đưa vào lịch chăm sóc',
    'Cần Broker kiểm tra lại',
    'Đã loại trừ'
  ];

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left border-collapse min-w-[920px]">
        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-[11px] font-semibold text-slate-600 uppercase tracking-wider select-none">
          <tr>
            <th
              className="py-2.5 px-3 w-24 cursor-pointer hover:bg-slate-100 transition"
              onClick={() => onToggleSort('id')}
            >
              <div className="flex items-center space-x-1">
                <span>Mã KH</span>
                <span className="text-slate-700 font-bold">{getSortIcon('id')}</span>
              </div>
            </th>
            <th
              className="py-2.5 px-3 cursor-pointer hover:bg-slate-100 transition"
              onClick={() => onToggleSort('company')}
            >
              <div className="flex items-center space-x-1">
                <span>Doanh nghiệp &amp; Vai trò</span>
                <span className="text-slate-700 font-bold">{getSortIcon('company')}</span>
              </div>
            </th>
            <th className="py-2.5 px-3">Mặt hàng &amp; Quy mô lô</th>
            <th className="py-2.5 px-3">Tuyến (POL &rarr; POD)</th>
            <th className="py-2.5 px-3">Nghiệp vụ &amp; Thuyết minh Lý giải (XAI)</th>
            <th
              className="py-2.5 px-3 w-28 text-right cursor-pointer hover:bg-slate-100 transition"
              onClick={() => onToggleSort('score')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Điểm / Nhóm</span>
                <span className="text-slate-700 font-bold">{getSortIcon('score')}</span>
              </div>
            </th>
            <th className="py-2.5 px-3 w-44 text-left">Trạng thái thẩm định</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-xs">
          {leads.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-10 px-4 text-center text-slate-500 text-xs">
                Không có hồ sơ khách hàng nào khớp với tiêu chí lọc hiện tại.
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="ml-2 text-[#0F3D75] underline font-medium cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </td>
            </tr>
          ) : (
            leads.map(item => {
              const isExcluded = item.group === 'C';
              const isSelected = item.id === selectedLeadId;

              let rowBg = isExcluded
                ? 'bg-slate-50/70 text-slate-500 hover:bg-slate-100/80'
                : 'bg-white hover:bg-blue-50/40';
              if (isSelected) {
                rowBg = 'bg-blue-50/80';
              }

              let groupBadge = (
                <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-300">
                  Nhóm C
                </span>
              );
              let scoreClass = 'text-slate-400';
              if (item.group === 'A') {
                groupBadge = (
                  <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    Nhóm A
                  </span>
                );
                scoreClass = 'text-emerald-800 font-bold';
              } else if (item.group === 'B') {
                groupBadge = (
                  <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                    Nhóm B
                  </span>
                );
                scoreClass = 'text-amber-700 font-bold';
              }

              let serviceLabel = (
                <span className="text-[11px] font-medium text-slate-500">{item.service}</span>
              );
              if (item.service === 'Dry Bulk Chartering') {
                serviceLabel = (
                  <span className="text-[11px] font-semibold text-[#0F3D75]">Dry Bulk Chartering</span>
                );
              } else if (item.service === 'Project / Breakbulk') {
                serviceLabel = (
                  <span className="text-[11px] font-semibold text-indigo-800">Project / Breakbulk</span>
                );
              }

              let statusSelectStyle = 'border-slate-300 bg-white text-slate-600';
              if (item.status === 'Đã duyệt tiếp cận') {
                statusSelectStyle = 'border-emerald-300 bg-emerald-50 text-emerald-800 font-medium';
              } else if (item.status === 'Giao Senior Broker') {
                statusSelectStyle = 'border-blue-300 bg-blue-50 text-blue-800 font-medium';
              } else if (item.status === 'Đưa vào lịch chăm sóc') {
                statusSelectStyle = 'border-amber-300 bg-amber-50 text-amber-800 font-medium';
              } else if (item.status === 'Cần Broker kiểm tra lại') {
                statusSelectStyle = 'border-red-300 bg-red-50 text-red-800 font-semibold';
              }

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectLead(item.id)}
                  className={`${rowBg} transition cursor-pointer`}
                >
                  <td
                    className={`py-2.5 px-3 font-mono tabular-nums text-[11px] ${
                      isExcluded ? 'text-slate-400' : 'text-slate-600 font-medium'
                    } align-top`}
                  >
                    {item.id}
                  </td>
                  <td className="py-2.5 px-3 align-top">
                    <div
                      className={`font-semibold ${isExcluded ? 'text-slate-600' : 'text-slate-900'}`}
                    >
                      {item.company}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.role} &middot; Nguồn: {item.source}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 align-top">
                    <div className={isExcluded ? 'text-slate-500' : 'font-medium text-slate-800'}>
                      {item.cargo}
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-slate-500 mt-0.5">
                      {item.volume}
                    </div>
                  </td>
                  <td
                    className={`py-2.5 px-3 align-top ${
                      isExcluded ? 'text-slate-500' : 'font-medium text-slate-800'
                    }`}
                  >
                    {item.route}
                  </td>
                  <td className="py-2.5 px-3 align-top max-w-xs">
                    <div className="flex items-center justify-between">
                      {serviceLabel}
                      <span className="text-[10px] text-[#0F3D75] hover:underline font-medium">
                        Chi tiết XAI &rarr;
                      </span>
                    </div>
                    <p
                      className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-snug"
                      title={item.reason}
                    >
                      {item.reason}
                    </p>
                  </td>
                  <td className="py-2.5 px-3 align-top text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className={`font-mono tabular-nums text-xs ${scoreClass}`}>
                        {String(item.score).padStart(2, '0')}
                      </span>
                      {groupBadge}
                    </div>
                    {item.manualGroup !== 'AUTO' && (
                      <span className="text-[10px] text-blue-700 block mt-0.5">Đã ghi đè</span>
                    )}
                  </td>
                  <td
                    className="py-2.5 px-3 align-top"
                    onClick={e => e.stopPropagation()}
                  >
                    <select
                      value={item.status}
                      aria-label={`Cập nhật trạng thái thẩm định cho ${item.company}`}
                      onChange={e => onUpdateStatus(item.id, e.target.value as LeadStatus)}
                      className={`w-full border px-2 py-1 text-[11px] cursor-pointer focus:outline-none ${statusSelectStyle}`}
                    >
                      {statuses.map(st => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
