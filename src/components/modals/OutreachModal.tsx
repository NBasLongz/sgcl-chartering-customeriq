'use client';

import { useState, useEffect } from 'react';
import { EvaluatedLead } from '@/lib/types/lead';

interface OutreachModalProps {
  lead: EvaluatedLead | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export default function OutreachModal({
  lead,
  isOpen,
  onClose,
  onShowToast
}: OutreachModalProps) {
  const [language, setLanguage] = useState<'VI' | 'EN'>('VI');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (!lead) return;

    if (language === 'VI') {
      setSubject(`[SGCL Chartering] Đề xuất phương án tàu vận chuyển ${lead.cargo} (${lead.volume}) - Tuyến ${lead.route}`);
      setBody(`Kính gửi Phòng Xuất Nhập Khẩu / Logistics - ${lead.company},

Tôi là Chuyên viên Môi giới Tàu biển (Chartering Executive) từ Công ty Cổ phần Dịch vụ Tiếp vận và Thương mại Sài Gòn Cửu Long (SGCL).

Qua theo dõi nhu cầu vận chuyển trên tuyến ${lead.route}, SGCL được biết Quý Công ty thường xuyên có các lô hàng ${lead.cargo} với quy mô khoảng ${lead.volume}.

Hiện tại, mạng lưới hơn 90 chủ tàu đối tác trong nước và quốc tế của SGCL đang có các vị trí tàu ${lead.vesselFit} mở (open) tại khu vực Đông Nam Á / Đông Á rất phù hợp để nhận hàng của Quý Công ty với mức cước cạnh tranh.

Để SGCL có thể gửi Báo giá chỉ dẫn (Indicative Freight Offer) và đề xuất tàu sát nhất, Quý Công ty vui lòng cho xin thêm các thông số dự kiến của lô hàng sắp tới:
1. Khối lượng chuẩn & Hệ số chất xếp (Volume & Stowage Factor - SF): ${lead.volume}
2. Cảng xếp / Cảng dỡ cụ thể (POL / POD & Max Draft): ${lead.route}
3. Thời gian hàng sẵn sàng (Laycan): ...
4. Tốc độ làm hàng hai đầu cảng (Loading / Discharging Rate): ...

Rất mong nhận được phản hồi của Quý Công ty để hai bên trao đổi chi tiết hơn.

Trân trọng,
Bộ phận Thuê tàu & Môi giới Hàng hải (Chartering Department)
Saigon Cuulong JSC (SGCL) | 20/5 Tân Cảng, TP. Hồ Chí Minh`);
    } else {
      setSubject(`[SGCL Chartering] Vessel Tonnage Proposal for ${lead.cargo} (${lead.volume}) // ${lead.route}`);
      setBody(`Dear Chartering / Logistics Team at ${lead.company},

Good day. We are contacting you from the Chartering Department of Saigon Cuulong JSC (SGCL) - Dry Bulk & Project Cargo Shipbrokers in Ho Chi Minh City.

Understanding your regular shipping activities for ${lead.cargo} (${lead.volume}) on the trade lane ${lead.route}, we would like to introduce our direct tonnage positions (${lead.vesselFit}) from our network of 90+ domestic and international shipowners.

Could you kindly share your next firm cargo inquiry or indicative schedule with the following details so we can provide a competitive freight indication:
- Commodity & Quantity: ${lead.cargo} (${lead.volume})
- POL / POD & Port Restrictions (Max Draft / LOA): ${lead.route}
- Laycan: [Please advise]
- Load / Discharge Rates (L/D Rate SHINC/SHEX): [Please advise]
- Freight Idea / Commission structure: [Please advise]

We look forward to hearing from you and supporting your upcoming fixtures.

Best Regards,
Chartering Department — Saigon Cuulong JSC (SGCL)
Add: SGCL Building, 20/5 Tan Cang St., HCMC, Vietnam`);
    }
  }, [lead, language]);

  if (!isOpen || !lead) return null;

  const handleCopy = () => {
    const combined = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(combined).then(() => {
      onShowToast('Đã sao chép tiêu đề và nội dung Email tiếp cận vào bộ nhớ tạm');
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="outreachModalTitle"
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 id="outreachModalTitle" className="text-base font-bold text-slate-900">
              Dự thảo Thư chào tàu &amp; Kịch bản Tiếp cận Khách hàng
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Tự động trích xuất thông số Mặt hàng &ndash; Tuyến &ndash; Cỡ tàu để tạo bản nháp chào cước chuẩn nghiệp vụ Broker
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="text-slate-400 hover:text-slate-700 text-xl font-bold px-2 py-1 cursor-pointer rounded"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block text-xs">Khách hàng mục tiêu:</span>
              <span className="font-bold text-slate-900 text-base">{lead.company}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Phân nhóm &amp; Nghiệp vụ:</span>
              <span className="font-semibold text-[#4299e1] text-sm">
                Nhóm {lead.group} ({lead.score}/100đ) &middot; {lead.service}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Lô hàng &amp; Tuyến:</span>
              <span className="font-medium text-slate-800 text-sm">
                {lead.cargo} ({lead.volume}) &middot; Tuyến: {lead.route}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">
                Phương thức tiếp cận phù hợp:
              </span>
              <span className="font-medium text-emerald-800 text-sm">
                {lead.group === 'A'
                  ? 'Email chào cước chỉ dẫn + Liên hệ điện thoại trực tiếp'
                  : 'Gửi Email Bản tin Thị trường Cước & Lịch tàu định kỳ'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label htmlFor="outreachLangSelect" className="font-semibold text-slate-700 text-sm">
              Ngôn ngữ bản nháp chào hàng (Tonnage / Cargo Offer):
            </label>
            <select
              id="outreachLangSelect"
              value={language}
              onChange={e => setLanguage(e.target.value as 'VI' | 'EN')}
              className="border border-slate-300 bg-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer focus:border-[#4299e1] focus:outline-none"
            >
              <option value="VI">Tiếng Việt (Chủ hàng / XNK Nội địa)</option>
              <option value="EN">Tiếng Anh Quốc tế (Standard Baltic / BIMCO Style)</option>
            </select>
          </div>

          <div>
            <label htmlFor="outreachSubject" className="block text-slate-700 mb-1 font-medium text-sm">
              Tiêu đề Email (Subject Line):
            </label>
            <input
              id="outreachSubject"
              type="text"
              readOnly
              value={subject}
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-3.5 py-2 font-mono text-sm text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="outreachBody" className="block text-slate-700 mb-1 font-medium text-sm">
              Nội dung Email &amp; Câu hỏi khai thác thông số kỹ thuật (Broker có thể chỉnh sửa):
            </label>
            <textarea
              id="outreachBody"
              rows={9}
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md p-3.5 font-mono text-sm text-slate-800 leading-relaxed focus:border-[#4299e1] focus:outline-none"
            />
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm leading-relaxed">
            <strong>Lưu ý nghiệp vụ Broker:</strong> Chuyên viên môi giới cần kiểm tra lại tình trạng tàu trống thực tế (Open Position), giới hạn mớn nước cảng (Draft) và mức cước chỉ dẫn trước khi gửi chính thức cho khách hàng.
          </div>
        </div>

        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-[#4299e1] hover:bg-[#3182ce] text-white font-medium rounded-md transition cursor-pointer shadow-xs"
          >
            Sao chép Nội dung Email
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md hover:bg-slate-50 transition cursor-pointer font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
