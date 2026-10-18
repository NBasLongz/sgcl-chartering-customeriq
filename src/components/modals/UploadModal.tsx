'use client';

import { useState } from 'react';
import { downloadSampleExcelTemplate } from '@/lib/engine/excel';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportExcel: (file: File, replaceExisting: boolean) => Promise<void>;
  onAddQuickLead: (lead: {
    company: string;
    role: string;
    source: string;
    cargo: string;
    volume: string;
    route: string;
  }) => void;
  onResetSampleData: () => void;
  onShowToast: (msg: string) => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  onImportExcel,
  onAddQuickLead,
  onResetSampleData,
  onShowToast
}: UploadModalProps) {
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Quick form states
  const [quickCompany, setQuickCompany] = useState('');
  const [quickRole, setQuickRole] = useState('Shipper / Charterer');
  const [quickSource, setQuickSource] = useState('Khai thác trực tiếp');
  const [quickCargo, setQuickCargo] = useState('');
  const [quickVolume, setQuickVolume] = useState('');
  const [quickRoute, setQuickRoute] = useState('');
  const [quickError, setQuickError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadFeedback(null);
    try {
      await onImportExcel(file, replaceExisting);
      setUploadFeedback({
        type: 'success',
        message: `Đã nạp và tự động so khớp thành công dữ liệu từ file "${file.name}".`
      });
    } catch (err) {
      setUploadFeedback({
        type: 'error',
        message: `Lỗi đọc file: ${err instanceof Error ? err.message : 'Định dạng file không hợp lệ.'}`
      });
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleQuickAdd = () => {
    if (!quickCompany.trim() || !quickCargo.trim() || !quickVolume.trim() || !quickRoute.trim()) {
      setQuickError('Vui lòng nhập đầy đủ Tên doanh nghiệp, Mặt hàng, Quy mô lô hàng và Tuyến vận chuyển.');
      return;
    }
    setQuickError(null);

    onAddQuickLead({
      company: quickCompany.trim(),
      role: quickRole,
      source: quickSource.trim() || 'Nạp trực tiếp',
      cargo: quickCargo.trim(),
      volume: quickVolume.trim(),
      route: quickRoute.trim()
    });

    setQuickCompany('');
    setQuickCargo('');
    setQuickVolume('');
    setQuickRoute('');
  };

  const handleDownloadTemplate = () => {
    downloadSampleExcelTemplate();
    onShowToast('Đã tải xuống file mẫu: SGCL_File_Mau_Khach_Hang_Tho.xlsx');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="uploadModalTitle"
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div className="bg-white border border-slate-300 shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 id="uploadModalTitle" className="text-sm font-bold text-slate-900">
              Nạp Dữ liệu Khách hàng Thô (.xlsx / .csv)
            </h3>
            <p className="text-xs text-slate-500">
              Hỗ trợ tự động nhận diện linh hoạt các biến thể tên cột tiếng Việt &amp; tiếng Anh
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="text-slate-400 hover:text-slate-700 text-lg font-bold px-1 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs overflow-y-auto">
          {/* File Upload Box */}
          <div className="border border-dashed border-slate-300 p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">
                1. Nạp từ file Excel (.xlsx, .xls) hoặc CSV
              </span>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-[#0F3D75] hover:underline font-medium text-[11px] cursor-pointer"
              >
                Tải file mẫu chuẩn (.xlsx)
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hệ thống tự động so khớp các tên cột: <em>Tên công ty / Khách hàng</em>, <em>Mặt hàng / Ngành nghề / Sản phẩm</em>, <em>Tuyến / Cảng / Thị trường</em>, <em>Sản lượng / Quy mô / Khối lượng</em>.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                disabled={isProcessing}
                onChange={handleFileChange}
                className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:border file:border-slate-300 file:text-xs file:font-medium file:bg-white file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
              />
              <label className="flex items-center space-x-1.5 text-[11px] text-slate-600 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={replaceExisting}
                  onChange={e => setReplaceExisting(e.target.checked)}
                  className="border-slate-300"
                />
                <span>Thay thế DS hiện tại</span>
              </label>
            </div>

            {uploadFeedback && (
              <div
                className={`p-2.5 border text-xs ${
                  uploadFeedback.type === 'success'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : 'border-red-300 bg-red-50 text-red-800'
                }`}
              >
                {uploadFeedback.message}
              </div>
            )}
          </div>

          {/* Quick Single Entry Form */}
          <div className="border border-slate-200 p-4 space-y-3">
            <span className="font-semibold text-slate-800 block">
              2. Thêm trực tiếp 1 hồ sơ khách hàng để kiểm thử
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1">Tên doanh nghiệp *</label>
                <input
                  type="text"
                  value={quickCompany}
                  onChange={e => setQuickCompany(e.target.value)}
                  placeholder="VD: Công ty CP Xi măng Nghi Sơn"
                  className="w-full border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Vai trò</label>
                <select
                  value={quickRole}
                  onChange={e => setQuickRole(e.target.value)}
                  className="w-full border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none cursor-pointer"
                >
                  <option value="Shipper / Charterer">Shipper / Charterer</option>
                  <option value="Shipper">Shipper (Chủ hàng)</option>
                  <option value="Charterer">Charterer (Người thuê tàu)</option>
                  <option value="Trader">Trader (Thương mại)</option>
                  <option value="Forwarder">Forwarder</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Nguồn thu thập</label>
                <input
                  type="text"
                  value={quickSource}
                  onChange={e => setQuickSource(e.target.value)}
                  placeholder="VD: Cổng Hải quan / Hiệp hội VLA"
                  className="w-full border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Mặt hàng kinh doanh *</label>
                <input
                  type="text"
                  value={quickCargo}
                  onChange={e => setQuickCargo(e.target.value)}
                  placeholder="VD: Clinker &amp; Đá vôi xá"
                  className="w-full border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Quy mô lô hàng / Tần suất *</label>
                <input
                  type="text"
                  value={quickVolume}
                  onChange={e => setQuickVolume(e.target.value)}
                  placeholder="VD: 15.000 MT / chuyến"
                  className="w-full border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1">Tuyến vận chuyển (POL &rarr; POD) *</label>
                <input
                  type="text"
                  value={quickRoute}
                  onChange={e => setQuickRoute(e.target.value)}
                  placeholder="VD: Nghi Sơn → Chittagong"
                  className="w-full border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none"
                />
              </div>
            </div>

            {quickError && (
              <div className="p-2 bg-red-50 border border-red-300 text-red-800 text-xs">
                {quickError}
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="bg-[#0F3D75] hover:bg-[#0A2B54] text-white font-medium px-3.5 py-1.5 transition cursor-pointer"
              >
                Chấm điểm &amp; Thêm vào bảng
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={onResetSampleData}
            className="text-slate-600 hover:text-slate-900 underline cursor-pointer"
          >
            Khôi phục 12 hồ sơ mẫu ban đầu
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
