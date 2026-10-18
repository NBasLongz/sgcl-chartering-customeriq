'use client';

import { useState } from 'react';
import { downloadSampleExcelTemplate } from '@/lib/engine/excel';

interface EmptyStateProps {
  onImportExcel: (file: File, replaceExisting: boolean) => Promise<void>;
  onLoadSample: () => void;
  onShowToast: (msg: string) => void;
}

export default function EmptyState({ onImportExcel, onLoadSample, onShowToast }: EmptyStateProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      await onImportExcel(file, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đọc file. Vui lòng kiểm tra định dạng.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDownloadTemplate = () => {
    downloadSampleExcelTemplate();
    onShowToast('Đã tải file mẫu về máy');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 animate-fade-up">
      <div className="w-full max-w-2xl">

        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-3 mb-6">
            <span className="bg-[#0F3D75] text-white font-black px-3 py-1.5 text-sm tracking-widest rounded">
              SGCL
            </span>
            <span className="text-gray-400 text-xl font-light">|</span>
            <span className="text-gray-700 font-semibold text-lg">CustomerIQ</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Hệ thống Sàng lọc Khách hàng
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            Nạp danh sách doanh nghiệp để tự động chấm điểm, phân loại và sinh thuyết minh lý giải nghiệp vụ.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer
            ${isDragging
              ? 'border-[#0F3D75] bg-blue-50 scale-[1.01]'
              : 'border-gray-200 bg-white hover:border-[#0F3D75] hover:bg-blue-50/30'
            }`}
          onClick={() => document.getElementById('fileInputMain')?.click()}
        >
          <input
            id="fileInputMain"
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileInput}
          />

          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-10 h-10 border-3 border-gray-200 border-t-[#0F3D75] rounded-full animate-spin" />
              <p className="text-gray-500 font-medium">Đang đọc và phân tích dữ liệu...</p>
            </div>
          ) : (
            <>
              {/* Upload Icon */}
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors
                ${isDragging ? 'bg-[#0F3D75]' : 'bg-gray-100'}`}>
                <svg className={`w-7 h-7 ${isDragging ? 'text-white' : 'text-gray-400'}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <p className="text-gray-900 font-semibold text-lg mb-2">
                {isDragging ? 'Thả file vào đây' : 'Kéo thả file hoặc bấm để chọn'}
              </p>
              <p className="text-gray-400 text-sm mb-1">
                Hỗ trợ định dạng <span className="font-medium text-gray-600">.xlsx</span>, <span className="font-medium text-gray-600">.xls</span>, <span className="font-medium text-gray-600">.csv</span>
              </p>
              <p className="text-gray-400 text-sm">
                Tự động nhận diện cột: Tên công ty, Mặt hàng, Tuyến, Sản lượng...
              </p>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in">
            <strong>Lỗi:</strong> {error}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center space-x-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm font-medium">hoặc</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onLoadSample}
            className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 bg-[#0F3D75] text-white font-semibold rounded-xl hover:bg-[#0A2B54] transition-colors text-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Dùng 12 hồ sơ mẫu kiểm thử</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Tải file mẫu Excel (.xlsx)</span>
          </button>
        </div>

        {/* Feature Hints */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { icon: '🎯', label: 'Chấm điểm 3 chiều', desc: 'Hàng · Tuyến · Cỡ tàu' },
            { icon: '🔍', label: 'Thuyết minh XAI', desc: '4 bước lý giải nghiệp vụ' },
            { icon: '📧', label: 'Soạn Email', desc: 'Chào cước chuẩn Baltic' },
          ].map(f => (
            <div key={f.label} className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="font-semibold text-gray-800 text-sm">{f.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
