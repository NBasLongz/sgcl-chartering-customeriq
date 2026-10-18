'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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

  // Column widths state for drag-to-resize
  const [colWidths, setColWidths] = useState({
    id: 100,
    company: 260,
    cargo: 230,
    route: 220,
    rationale: 360,
    score: 170,
    status: 200
  });

  const resizingColRef = useRef<keyof typeof colWidths | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDownResize = (colKey: keyof typeof colWidths, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizingColRef.current = colKey;
    startXRef.current = e.clientX;
    startWidthRef.current = colWidths[colKey];
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingColRef.current) return;
    const delta = e.clientX - startXRef.current;
    const newWidth = Math.max(75, startWidthRef.current + delta);
    const colKey = resizingColRef.current;
    setColWidths(prev => ({
      ...prev,
      [colKey]: newWidth
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    resizingColRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const totalTableWidth = Object.values(colWidths).reduce((a, b) => a + b, 0);

  return (
    <div className="flex-1 overflow-auto bg-white select-none">
      <table
        className="text-left border-collapse table-fixed"
        style={{ width: `${totalTableWidth}px`, minWidth: `${totalTableWidth}px` }}
      >
        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-20 text-xs font-semibold text-slate-600 uppercase tracking-wider shadow-2xs">
          <tr>
            {/* Col 1: Mã KH */}
            <th
              style={{ width: `${colWidths.id}px` }}
              className="py-3 px-3.5 relative group hover:bg-slate-100 transition cursor-pointer"
              onClick={() => onToggleSort('id')}
              title="Kéo mép phải để chỉnh độ rộng cột"
            >
              <div className="flex items-center space-x-1">
                <span>Mã KH</span>
                <span className="text-[#4299e1] font-bold">{getSortIcon('id')}</span>
              </div>
              <div
                onMouseDown={(e) => handleMouseDownResize('id', e)}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-[#4299e1] active:bg-[#3182ce] transition-colors z-30"
              />
            </th>

            {/* Col 2: Doanh nghiệp & Vai trò */}
            <th
              style={{ width: `${colWidths.company}px` }}
              className="py-3 px-3.5 relative group hover:bg-slate-100 transition cursor-pointer"
              onClick={() => onToggleSort('company')}
              title="Kéo mép phải để chỉnh độ rộng cột"
            >
              <div className="flex items-center space-x-1">
                <span>Doanh nghiệp &amp; Vai trò</span>
                <span className="text-[#4299e1] font-bold">{getSortIcon('company')}</span>
              </div>
              <div
                onMouseDown={(e) => handleMouseDownResize('company', e)}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-[#4299e1] active:bg-[#3182ce] transition-colors z-30"
              />
            </th>

            {/* Col 3: Mặt hàng & Quy mô */}
            <th
              style={{ width: `${colWidths.cargo}px` }}
              className="py-3 px-3.5 relative group"
              title="Kéo mép phải để chỉnh độ rộng cột"
            >
              <span>Mặt hàng &amp; Quy mô lô</span>
              <div
                onMouseDown={(e) => handleMouseDownResize('cargo', e)}
                className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-[#4299e1] active:bg-[#3182ce] transition-colors z-30"
              />
            </th>

            {/* Col 4: Tuyến POL -> POD */}
            <th
              style={{ width: `${colWidths.route}px` }}
              className="py-3 px-3.5 relative group"
              title="Kéo mép phải để chỉnh độ rộng cột"
            >
              <span>Tuyến (POL &rarr; POD)</span>
              <div
                onMouseDown={(e) => handleMouseDownResize('route', e)}
                className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-[#4299e1] active:bg-[#3182ce] transition-colors z-30"
              />
            </th>

            {/* Col 5: Nghiệp vụ & Thuyết minh */}
            <th
              style={{ width: `${colWidths.rationale}px` }}
              className="py-3 px-3.5 relative group"
              title="Kéo mép phải để chỉnh độ rộng cột"
            >
              <span>Nghiệp vụ &amp; Thuyết minh Đánh giá</span>
              <div
                onMouseDown={(e) => handleMouseDownResize('rationale', e)}
                className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-[#4299e1] active:bg-[#3182ce] transition-colors z-30"
              />
            </th>

            {/* Col 6: Điểm / Phân hạng */}
            <th
              style={{ width: `${colWidths.score}px` }}
              className="py-3 px-3.5 text-right relative group hover:bg-slate-100 transition cursor-pointer"
              onClick={() => onToggleSort('score')}
              title="Kéo mép phải để chỉnh độ rộng cột"
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Điểm / Phân hạng</span>
                <span className="text-[#4299e1] font-bold">{getSortIcon('score')}</span>
              </div>
              <div
                onMouseDown={(e) => handleMouseDownResize('score', e)}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-[#4299e1] active:bg-[#3182ce] transition-colors z-30"
              />
            </th>

            {/* Col 7: Trạng thái thẩm định */}
            <th
              style={{ width: `${colWidths.status}px` }}
              className="py-3 px-3.5 text-left relative group"
              title="Kéo mép phải để chỉnh độ rộng cột"
            >
              <span>Trạng thái thẩm định</span>
              <div
                onMouseDown={(e) => handleMouseDownResize('status', e)}
                className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-[#4299e1] active:bg-[#3182ce] transition-colors z-30"
              />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-sm">
          {leads.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-14 px-4 text-center text-slate-500 text-base">
                Không có hồ sơ khách hàng nào khớp với tiêu chí lọc hiện tại.
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="ml-2 text-[#4299e1] hover:text-[#3182ce] underline font-semibold cursor-pointer"
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
                ? 'bg-slate-50/70 text-slate-500 hover:bg-slate-100/70'
                : 'bg-white hover:bg-slate-50/80';
              if (isSelected) {
                rowBg = 'bg-blue-50/70 border-l-4 border-l-[#4299e1]';
              }

              let groupBadge = (
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-300">
                  Nhóm C
                </span>
              );
              let scoreClass = 'text-slate-400';
              if (item.group === 'A') {
                groupBadge = (
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300">
                    Nhóm A
                  </span>
                );
                scoreClass = 'text-emerald-700 font-bold';
              } else if (item.group === 'B') {
                groupBadge = (
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-300">
                    Nhóm B
                  </span>
                );
                scoreClass = 'text-amber-700 font-bold';
              }

              let serviceLabel = (
                <span className="text-xs font-semibold text-slate-500">{item.service}</span>
              );
              if (item.service === 'Dry Bulk Chartering') {
                serviceLabel = (
                  <span className="text-xs font-bold text-[#4299e1]">Dry Bulk Chartering</span>
                );
              } else if (item.service === 'Project / Breakbulk') {
                serviceLabel = (
                  <span className="text-xs font-bold text-indigo-700">Project / Breakbulk</span>
                );
              }

              let statusSelectStyle = 'border-slate-300 bg-white text-slate-800';
              if (item.status === 'Đã duyệt tiếp cận') {
                statusSelectStyle = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold';
              } else if (item.status === 'Giao Senior Broker') {
                statusSelectStyle = 'border-blue-300 bg-blue-50 text-blue-900 font-semibold';
              } else if (item.status === 'Đưa vào lịch chăm sóc') {
                statusSelectStyle = 'border-amber-300 bg-amber-50 text-amber-900 font-semibold';
              } else if (item.status === 'Cần Broker kiểm tra lại') {
                statusSelectStyle = 'border-red-300 bg-red-50 text-red-900 font-bold';
              }

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectLead(item.id)}
                  className={`${rowBg} transition cursor-pointer`}
                >
                  <td
                    style={{ width: `${colWidths.id}px` }}
                    className={`py-3.5 px-3.5 font-mono tabular-nums text-sm ${
                      isExcluded ? 'text-slate-400' : 'text-slate-700 font-bold'
                    } align-top truncate`}
                  >
                    {item.id}
                  </td>
                  <td
                    style={{ width: `${colWidths.company}px` }}
                    className="py-3.5 px-3.5 align-top"
                  >
                    <div
                      className={`text-base font-bold truncate ${isExcluded ? 'text-slate-600' : 'text-slate-900'}`}
                    >
                      {item.company}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 truncate">
                      {item.role} &middot; Nguồn: {item.source}
                    </div>
                  </td>
                  <td
                    style={{ width: `${colWidths.cargo}px` }}
                    className="py-3.5 px-3.5 align-top"
                  >
                    <div className={`truncate ${isExcluded ? 'text-slate-500' : 'text-sm font-semibold text-slate-800'}`}>
                      {item.cargo}
                    </div>
                    <div className="text-xs font-mono tabular-nums text-slate-500 mt-1 font-medium truncate">
                      {item.volume}
                    </div>
                  </td>
                  <td
                    style={{ width: `${colWidths.route}px` }}
                    className={`py-3.5 px-3.5 align-top text-sm truncate ${
                      isExcluded ? 'text-slate-500' : 'font-semibold text-slate-800'
                    }`}
                  >
                    {item.route}
                  </td>
                  <td
                    style={{ width: `${colWidths.rationale}px` }}
                    className="py-3.5 px-3.5 align-top"
                  >
                    <div className="flex items-center justify-between">
                      {serviceLabel}
                      <span className="text-xs text-[#4299e1] hover:underline font-bold shrink-0 ml-2">
                        Chi tiết &rarr;
                      </span>
                    </div>
                    <p
                      className="text-sm text-slate-700 mt-1 line-clamp-2 leading-relaxed"
                      title={item.reason}
                    >
                      {item.reason}
                    </p>
                  </td>
                  <td
                    style={{ width: `${colWidths.score}px` }}
                    className="py-3.5 px-3.5 align-top text-right"
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <span className={`font-mono tabular-nums text-base ${scoreClass}`}>
                        {String(item.score).padStart(2, '0')}
                      </span>
                      {groupBadge}
                    </div>
                    {item.manualGroup !== 'AUTO' && (
                      <span className="text-xs text-[#4299e1] font-medium block mt-1">Đã ghi đè</span>
                    )}
                  </td>
                  <td
                    style={{ width: `${colWidths.status}px` }}
                    className="py-3.5 px-3.5 align-top"
                    onClick={e => e.stopPropagation()}
                  >
                    <select
                      value={item.status}
                      aria-label={`Cập nhật trạng thái thẩm định cho ${item.company}`}
                      onChange={e => onUpdateStatus(item.id, e.target.value as LeadStatus)}
                      className={`w-full border rounded-md px-3 py-2 text-xs cursor-pointer focus:outline-none transition ${statusSelectStyle}`}
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
