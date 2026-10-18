'use client';

import { EvaluatedLead, LeadGroup, LeadStatus } from '@/lib/types/lead';
import { ScoringRules } from '@/lib/types/rules';

interface InspectionDrawerProps {
  lead: EvaluatedLead | null;
  rules: ScoringRules;
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
      className="w-full lg:w-[420px] bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 overflow-y-auto animate-fade-in"
    >
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-semibold text-slate-500">
                {lead.id}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md ${badgeClass}`}>
                Nhóm {lead.group}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {lead.company}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Vai trò: {lead.role} &middot; Nguồn: {lead.source}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng chi tiết"
            className="text-slate-400 hover:text-slate-700 px-2 py-1 text-lg font-bold cursor-pointer rounded"
          >
            &times;
          </button>
        </div>

        {/* Action Button: Generate Outreach Email (For Group A & B) */}
        {isSuitable && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-[#0F3D75] block">
                Tiếp cận Khách hàng
              </span>
              <span className="text-xs text-slate-600">
                Tạo dự thảo Email chào tàu &amp; kịch bản liên hệ
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenOutreachModal}
              className="px-3 py-1.5 bg-[#0F3D75] text-white font-semibold text-xs rounded-md hover:bg-[#0A2B54] shrink-0 transition cursor-pointer"
            >
              Soạn Email Tiếp cận
            </button>
          </div>
        )}

        {/* 1. Score Breakdown Table */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              1. Bóc tách Điểm số Đa chiều
            </span>
            <span className="font-mono text-sm font-bold text-[#0F3D75]">
              {lead.score}/100
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg divide-y divide-slate-200 text-xs">
            <div className="px-3 py-2 flex justify-between items-center">
              <span className="text-slate-600">
                Độ khớp Mặt hàng ({rules.weightCargo}%)
              </span>
              <span className="font-mono font-semibold text-slate-900">
                {lead.scoreCargo} / {rules.weightCargo}
              </span>
            </div>
            <div className="px-3 py-2 flex justify-between items-center">
              <span className="text-slate-600">
                Tuyến &amp; Cảng POL/POD ({rules.weightRoute}%)
              </span>
              <span className="font-mono font-semibold text-slate-900">
                {lead.scoreRoute} / {rules.weightRoute}
              </span>
            </div>
            <div className="px-3 py-2 flex justify-between items-center">
              <span className="text-slate-600">
                Quy mô lô &amp; Cỡ tàu ({rules.weightVolume}%)
              </span>
              <span className="font-mono font-semibold text-slate-900">
                {lead.scoreVolume} / {rules.weightVolume}
              </span>
            </div>
            {lead.penalty > 0 && (
              <div className="px-3 py-2 flex justify-between items-center bg-red-50/70 text-red-800 rounded-b-lg">
                <span>Điểm phạt vi phạm tiêu chí loại trừ</span>
                <span className="font-mono font-semibold">-{lead.penalty}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Extracted Maritime Entities */}
        <div className="space-y-2 text-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            2. Thông tin Nghiệp vụ Khai thác
          </span>
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-xs">Mặt hàng vận chuyển:</span>
              <span className="font-semibold text-slate-800">{lead.cargo}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Quy mô lô hàng:</span>
              <span className="font-mono font-semibold text-slate-800">{lead.volume}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Tuyến vận tải:</span>
              <span className="font-semibold text-slate-800">{lead.route}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Phân hệ dịch vụ:</span>
              <span className="font-semibold text-[#0F3D75]">{lead.service}</span>
            </div>
            <div className="col-span-2 pt-1.5 border-t border-slate-200">
              <span className="text-slate-400 block text-xs">Đội tàu SGCL tương thích:</span>
              <span className="font-semibold text-slate-900">{lead.vesselFit}</span>
            </div>
          </div>
        </div>

        {/* 3. Reasoning & Rationale */}
        <div className="space-y-2 text-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            3. Căn cứ Đánh giá &amp; Thuyết minh Phân hạng
          </span>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs leading-relaxed text-slate-700">
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
        <div className="pt-2 border-t border-slate-200 space-y-3 text-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            4. Thẩm định &amp; Tác vụ của Broker
          </span>
          <div>
            <label className="block text-slate-600 mb-1">Trạng thái xử lý:</label>
            <select
              value={lead.status}
              onChange={e => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs font-medium text-slate-800 focus:border-[#0F3D75] focus:outline-none cursor-pointer"
            >
              {statuses.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Ghi đè phân nhóm (nếu cần):</label>
            <select
              value={lead.manualGroup || 'AUTO'}
              onChange={e => onOverrideGroup(lead.id, e.target.value as 'AUTO' | LeadGroup)}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:border-[#0F3D75] focus:outline-none cursor-pointer"
            >
              <option value="AUTO">Theo kết quả chấm điểm tự động</option>
              <option value="A">Ghi đè sang Nhóm A (Mục tiêu cốt lõi)</option>
              <option value="B">Ghi đè sang Nhóm B (Tiềm năng)</option>
              <option value="C">Ghi đè sang Nhóm C (Loại trừ)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">
              Ghi chú nghiệp vụ (Laycan, cước mục tiêu, liên hệ):
            </label>
            <textarea
              rows={2}
              value={lead.note || ''}
              onChange={e => onUpdateNote(lead.id, e.target.value)}
              placeholder="Nhập ghi chú thẩm định của Broker..."
              className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-xs text-slate-800 focus:border-[#0F3D75] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
        <button
          type="button"
          onClick={() => onDeleteLead(lead.id)}
          className="text-red-700 hover:underline text-xs cursor-pointer"
        >
          Xóa hồ sơ này
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 bg-[#0F3D75] text-white font-medium text-xs rounded-md hover:bg-[#0A2B54] transition cursor-pointer"
        >
          Hoàn tất kiểm tra
        </button>
      </div>
    </aside>
  );
}
