'use client';

import { EvaluatedLead, LeadGroup, LeadStatus } from '@/lib/types/lead';
import { ScoringRules } from '@/lib/types/rules';

interface DrawerV2Props {
  lead: EvaluatedLead | null;
  rules: ScoringRules;
  onClose: () => void;
  onOpenOutreach: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onOverrideGroup: (id: string, group: 'AUTO' | LeadGroup) => void;
  onUpdateNote: (id: string, note: string) => void;
  onDeleteLead: (id: string) => void;
}

const STATUSES: LeadStatus[] = [
  'Đã duyệt tiếp cận', 'Giao Senior Broker', 'Đưa vào lịch chăm sóc',
  'Cần Broker kiểm tra lại', 'Đã loại trừ',
];

export default function DrawerV2({
  lead, rules, onClose, onOpenOutreach,
  onUpdateStatus, onOverrideGroup, onUpdateNote, onDeleteLead,
}: DrawerV2Props) {
  if (!lead) return null;

  const isSuitable = lead.group === 'A' || lead.group === 'B';
  const scoreColor = lead.group === 'A' ? '#059669' : lead.group === 'B' ? '#D97706' : '#9CA3AF';

  return (
    <aside className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col shrink-0 animate-slide-in overflow-y-auto">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono text-xs text-gray-400">{lead.id}</span>
            {lead.manualGroup !== 'AUTO' && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">Ghi đè</span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 text-sm leading-snug">{lead.company}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{lead.role} · {lead.source}</p>
        </div>
        <button
          type="button" onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 p-5 space-y-5 overflow-y-auto">

        {/* Score Gauge */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Điểm tương thích</span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black" style={{ color: scoreColor }}>{lead.score}</span>
              <span className="text-gray-400 text-sm font-medium">/ 100</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                lead.group === 'A' ? 'bg-emerald-100 text-emerald-800' :
                lead.group === 'B' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'
              }`}>Nhóm {lead.group}</span>
            </div>
          </div>
          {/* Score breakdown bars */}
          <div className="space-y-2">
            {[
              { label: `Mặt hàng (${rules.weightCargo}%)`, val: lead.scoreCargo, max: rules.weightCargo, color: '#3B82F6' },
              { label: `Tuyến cảng (${rules.weightRoute}%)`, val: lead.scoreRoute, max: rules.weightRoute, color: '#8B5CF6' },
              { label: `Quy mô lô (${rules.weightVolume}%)`, val: lead.scoreVolume, max: rules.weightVolume, color: '#F59E0B' },
            ].map(bar => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{bar.label}</span>
                  <span className="font-mono font-semibold text-gray-700">{bar.val}/{bar.max}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full score-bar"
                    style={{ width: `${(bar.val / bar.max) * 100}%`, backgroundColor: bar.color }}
                  />
                </div>
              </div>
            ))}
            {lead.penalty > 0 && (
              <div className="flex justify-between text-xs text-red-600 pt-1 border-t border-red-100">
                <span>Phạt vi phạm Negative Gate</span>
                <span className="font-mono font-bold">−{lead.penalty}</span>
              </div>
            )}
          </div>
        </div>

        {/* Maritime Entities */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Thực thể hàng hải (NER)</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { k: 'Mặt hàng', v: lead.cargo },
              { k: 'Quy mô lô', v: lead.volume },
              { k: 'Tuyến POL→POD', v: lead.route },
              { k: 'Nghiệp vụ', v: lead.service },
            ].map(e => (
              <div key={e.k} className="bg-gray-50 rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-400 mb-0.5">{e.k}</p>
                <p className="font-semibold text-gray-800 text-xs leading-snug">{e.v}</p>
              </div>
            ))}
            <div className="col-span-2 bg-blue-50 rounded-lg px-3 py-2.5">
              <p className="text-xs text-blue-400 mb-0.5">Cỡ tàu tương thích (Vessel Fit)</p>
              <p className="font-semibold text-blue-900 text-xs leading-snug">{lead.vesselFit}</p>
            </div>
          </div>
        </div>

        {/* XAI Steps */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Thuyết minh Lý giải (XAI)</h4>
          <div className="space-y-2">
            {lead.xaiSteps?.map((step, i) => (
              <div key={i} className="flex space-x-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-[#0F3D75]/10 text-[#0F3D75] text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </div>
                <p
                  className="text-xs text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: step }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Broker Actions */}
        {isSuitable && (
          <button
            type="button"
            onClick={onOpenOutreach}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-[#0F3D75] text-white font-semibold rounded-xl hover:bg-[#0A2B54] transition text-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Soạn Email Tiếp cận</span>
          </button>
        )}

        {/* Broker Override */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Thẩm định Broker</h4>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Trạng thái xử lý</label>
            <select
              value={lead.status}
              onChange={e => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
              className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 rounded-lg focus:outline-none focus:border-[#0F3D75] cursor-pointer"
            >
              {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Ghi đè phân nhóm</label>
            <select
              value={lead.manualGroup || 'AUTO'}
              onChange={e => onOverrideGroup(lead.id, e.target.value as 'AUTO' | LeadGroup)}
              className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 rounded-lg focus:outline-none focus:border-[#0F3D75] cursor-pointer"
            >
              <option value="AUTO">Tự động (theo điểm AI)</option>
              <option value="A">Ghi đè → Nhóm A</option>
              <option value="B">Ghi đè → Nhóm B</option>
              <option value="C">Ghi đè → Nhóm C</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Ghi chú (Laycan, cước mục tiêu...)</label>
            <textarea
              rows={2}
              value={lead.note || ''}
              onChange={e => onUpdateNote(lead.id, e.target.value)}
              placeholder="Nhập ghi chú của Broker..."
              className="w-full bg-white border border-gray-200 px-3 py-2 text-sm text-gray-800 rounded-lg focus:outline-none focus:border-[#0F3D75] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center">
        <button
          type="button"
          onClick={() => onDeleteLead(lead.id)}
          className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
        >
          Xóa hồ sơ
        </button>
        <button
          type="button" onClick={onClose}
          className="text-sm font-semibold text-[#0F3D75] hover:underline cursor-pointer"
        >
          Đóng
        </button>
      </div>
    </aside>
  );
}
