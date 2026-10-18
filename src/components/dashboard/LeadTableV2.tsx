'use client';

import { EvaluatedLead, LeadStatus } from '@/lib/types/lead';
import { SortField, SortDirection } from '@/lib/types/rules';

interface LeadTableV2Props {
  leads: EvaluatedLead[];
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onResetFilters: () => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onToggleSort: (field: SortField) => void;
}

const GROUP_CONFIG = {
  A: { label: 'Nhóm A', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  B: { label: 'Nhóm B', cls: 'bg-amber-100 text-amber-800 border-amber-200'     },
  C: { label: 'Nhóm C', cls: 'bg-gray-100   text-gray-500  border-gray-200'     },
};

const STATUS_CONFIG: Record<string, string> = {
  'Đã duyệt tiếp cận':   'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Giao Senior Broker':  'text-blue-700    bg-blue-50    border-blue-200',
  'Đưa vào lịch chăm sóc': 'text-amber-700 bg-amber-50  border-amber-200',
  'Cần Broker kiểm tra lại': 'text-red-700 bg-red-50    border-red-200',
  'Đã loại trừ':         'text-gray-400   bg-gray-50    border-gray-200',
};

const STATUSES: LeadStatus[] = [
  'Đã duyệt tiếp cận', 'Giao Senior Broker', 'Đưa vào lịch chăm sóc',
  'Cần Broker kiểm tra lại', 'Đã loại trừ',
];

function SortIcon({ active, dir }: { active: boolean; dir: SortDirection }) {
  return (
    <span className={`ml-1 text-xs ${active ? 'text-[#0F3D75]' : 'text-gray-300'}`}>
      {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );
}

export default function LeadTableV2({
  leads, selectedLeadId, onSelectLead, onUpdateStatus,
  onResetFilters, sortField, sortDirection, onToggleSort,
}: LeadTableV2Props) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full border-collapse text-sm min-w-[860px]">
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <tr>
            <th
              className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 w-24"
              onClick={() => onToggleSort('id')}
            >
              Mã KH <SortIcon active={sortField === 'id'} dir={sortDirection} />
            </th>
            <th
              className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800"
              onClick={() => onToggleSort('company')}
            >
              Doanh nghiệp <SortIcon active={sortField === 'company'} dir={sortDirection} />
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Mặt hàng & Quy mô
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Tuyến vận chuyển
            </th>
            <th
              className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 w-28"
              onClick={() => onToggleSort('score')}
            >
              Điểm / Nhóm <SortIcon active={sortField === 'score'} dir={sortDirection} />
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide w-44">
              Trạng thái
            </th>
          </tr>
        </thead>

        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-20 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-400 font-medium">Không có kết quả khớp bộ lọc</p>
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-[#0F3D75] text-sm font-semibold hover:underline cursor-pointer"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </td>
            </tr>
          ) : (
            leads.map((item) => {
              const isExcluded = item.group === 'C';
              const isSelected = item.id === selectedLeadId;
              const group = GROUP_CONFIG[item.group as 'A' | 'B' | 'C'] || GROUP_CONFIG.C;

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectLead(item.id)}
                  className={`lead-row border-b border-gray-100 cursor-pointer transition-colors
                    ${isSelected ? 'selected' : ''}
                    ${isExcluded && !isSelected ? 'excluded' : ''}
                  `}
                >
                  {/* ID */}
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-gray-400 font-medium">{item.id}</span>
                  </td>

                  {/* Company */}
                  <td className="py-3 px-4">
                    <p className="font-semibold text-gray-900 text-sm leading-snug">{item.company}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.role}</p>
                  </td>

                  {/* Cargo */}
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-700 font-medium leading-snug">{item.cargo}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{item.volume}</p>
                  </td>

                  {/* Route */}
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-700">{item.route}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.service}</p>
                  </td>

                  {/* Score + Group */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col items-center space-y-1.5">
                      {/* Score bar */}
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full score-bar ${
                            item.group === 'A' ? 'bg-emerald-500' :
                            item.group === 'B' ? 'bg-amber-400' : 'bg-gray-300'
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-gray-800">{item.score}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${group.cls}`}>
                          {group.label}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={item.status}
                      onChange={(e) => onUpdateStatus(item.id, e.target.value as LeadStatus)}
                      className={`w-full text-xs font-medium px-2 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F3D75]/20 ${STATUS_CONFIG[item.status] || 'text-gray-600 bg-gray-50 border-gray-200'}`}
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
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
