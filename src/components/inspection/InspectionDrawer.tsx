'use client';

import { EvaluatedLead, LeadGroup, LeadStatus } from '@/lib/types/lead';
import { ScoringRules } from '@/lib/types/rules';

interface InspectionDrawerProps {
  lead: EvaluatedLead | null;
  rules: ScoringRules;
  width?: number;
  onClose: () => void;
  onOpenOutreachModal: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onOverrideGroup: (id: string, group: 'AUTO' | LeadGroup) => void;
  onUpdateNote: (id: string, note: string) => void;
  onDeleteLead: (id: string) => void;
}

export default function InspectionDrawer({
  lead,
  rules,
  width = 480,
  onClose,
  onOpenOutreachModal,
  onUpdateStatus,
  onOverrideGroup,
  onUpdateNote,
  onDeleteLead
}: InspectionDrawerProps) {
  if (!lead) return null;

  const isSuitable = lead.group === 'A' || lead.group === 'B';

  let badgeClass = 'bg-slate-100 text-slate-600 border border-slate-300';
  if (lead.group === 'A') {
    badgeClass = 'bg-emerald-50 text-emerald-800 border border-emerald-300';
  } else if (lead.group === 'B') {
    badgeClass = 'bg-amber-50 text-amber-800 border border-amber-300';
  }

  const statuses: LeadStatus[] = [
    'Đã duyệt tiếp cận',
    'Giao Senior Broker',
    'Đưa vào lịch chăm sóc',
    'Cần Broker kiểm tra lại',
    'Đã loại trừ'
  ];

  return (
    <aside
      aria-label="Chi tiết hồ sơ khách hàng và thẩm định nghiệp vụ"
      style={{ width: `${width}px` }}
      className="w-full bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 overflow-y-auto animate-fade-in shadow-lg z-20"
    >
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3.5">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="font-mono text-sm font-bold text-slate-600">
                {lead.id}
              </span>
              <span className={`px-3 py-1 text-xs font-bold rounded-md ${badgeClass}`}>
                Nhóm {lead.group}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1.5">
              {lead.company}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Vai trò: {lead.role} &middot; Nguồn: {lead.source}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng chi tiết"
            className="text-slate-400 hover:text-slate-700 px-2.5 py-1 text-xl font-bold cursor-pointer rounded"
          >
            &times;
          </button>
        </div>

        {/* Action Button: Generate Outreach Email (For Group A & B) */}
        {isSuitable && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5 flex items-center justify-between text-sm">
            <div>
              <span className="font-bold text-[#4299e1] block text-sm">
                Tiếp cận Khách hàng
              </span>
              <span className="text-xs text-slate-600">
                Tạo dự thảo Email chào tàu &amp; kịch bản liên hệ
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenOutreachModal}
              className="px-3.5 py-2 bg-[#4299e1] hover:bg-[#3182ce] text-white font-semibold text-xs rounded-md shrink-0 transition cursor-pointer shadow-xs"
            >
              Soạn Email Tiếp cận
            </button>
          </div>
        )}

        {/* 1. Score Breakdown Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Bóc tách Điểm số Đa chiều
            </span>
            <span className="font-mono text-base font-bold text-[#4299e1]">
              {lead.score}/100
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg divide-y divide-slate-200 text-sm">
            <div className="px-3.5 py-2.5 flex justify-between items-center">
              <span className="text-slate-700 font-medium">
                Độ khớp Mặt hàng ({rules.weightCargo}%)
              </span>
              <span className="font-mono font-bold text-slate-900">
                {lead.scoreCargo} / {rules.weightCargo}
              </span>
            </div>
            <div className="px-3.5 py-2.5 flex justify-between items-center">
              <span className="text-slate-700 font-medium">
                Tuyến &amp; Cảng POL/POD ({rules.weightRoute}%)
              </span>
              <span className="font-mono font-bold text-slate-900">
                {lead.scoreRoute} / {rules.weightRoute}
              </span>
            </div>
            <div className="px-3.5 py-2.5 flex justify-between items-center">
              <span className="text-slate-700 font-medium">
                Quy mô lô &amp; Cỡ tàu ({rules.weightVolume}%)
              </span>
              <span className="font-mono font-bold text-slate-900">
                {lead.scoreVolume} / {rules.weightVolume}
              </span>
            </div>
            {lead.penalty > 0 && (
              <div className="px-3.5 py-2.5 flex justify-between items-center bg-red-50/70 text-red-900 font-medium rounded-b-lg">
                <span>Điểm phạt vi phạm tiêu chí loại trừ</span>
                <span className="font-mono font-bold">-{lead.penalty}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Extracted Maritime Entities */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            2. Thông tin Nghiệp vụ Khai thác
          </span>
          <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-sm">
            <div>
              <span className="text-slate-500 block text-xs">Mặt hàng vận chuyển:</span>
              <span className="font-bold text-slate-900">{lead.cargo}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Quy mô lô hàng:</span>
              <span className="font-mono font-bold text-slate-900">{lead.volume}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Tuyến vận tải:</span>
              <span className="font-bold text-slate-900">{lead.route}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Phân hệ dịch vụ:</span>
              <span className="font-bold text-[#4299e1]">{lead.service}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200">
              <span className="text-slate-500 block text-xs">Đội tàu SGCL tương thích:</span>
              <span className="font-bold text-slate-900">{lead.vesselFit}</span>
            </div>
          </div>
        </div>

        {/* 3. Reasoning & Rationale */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            3. Căn cứ Đánh giá &amp; Thuyết minh Phân hạng
          </span>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5 text-sm leading-relaxed text-slate-800">
            {lead.xaiSteps && lead.xaiSteps.length > 0 ? (
              lead.xaiSteps.map((step, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: step }} />
              ))
            ) : (
              <p>{lead.reason}</p>
            )}
          </div>
        </div>

        {/* 4. Manual Broker Override & Notes */}
        <div className="pt-2 border-t border-slate-200 space-y-3.5 text-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            4. Thẩm định &amp; Tác vụ của Broker
          </span>
          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">Trạng thái xử lý:</label>
            <select
              value={lead.status}
              onChange={e => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
              className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-[#4299e1] focus:outline-none cursor-pointer"
            >
              {statuses.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">Ghi đè phân nhóm (nếu cần):</label>
            <select
              value={lead.manualGroup || 'AUTO'}
              onChange={e => onOverrideGroup(lead.id, e.target.value as 'AUTO' | LeadGroup)}
              className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2 text-sm text-slate-800 focus:border-[#4299e1] focus:outline-none cursor-pointer"
            >
              <option value="AUTO">Theo kết quả chấm điểm tự động</option>
              <option value="A">Ghi đè sang Nhóm A (Mục tiêu cốt lõi)</option>
              <option value="B">Ghi đè sang Nhóm B (Tiềm năng)</option>
              <option value="C">Ghi đè sang Nhóm C (Loại trừ)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">
              Ghi chú nghiệp vụ (Laycan, cước mục tiêu, liên hệ):
            </label>
            <textarea
              rows={2}
              value={lead.note || ''}
              onChange={e => onUpdateNote(lead.id, e.target.value)}
              placeholder="Nhập ghi chú thẩm định của Broker..."
              className="w-full bg-white border border-slate-300 rounded-md p-3 text-sm text-slate-800 focus:border-[#4299e1] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-sm">
        <button
          type="button"
          onClick={() => onDeleteLead(lead.id)}
          className="text-red-700 hover:underline text-sm font-medium cursor-pointer"
        >
          Xóa hồ sơ này
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-[#4299e1] hover:bg-[#3182ce] text-white font-semibold text-sm rounded-md transition cursor-pointer shadow-xs"
        >
          Hoàn tất kiểm tra
        </button>
      </div>
    </aside>
  );
}
