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
    onShowToast('Đã tải xuống biểu mẫu Excel: SGCL_File_Mau_Khach_Hang_Tho.xlsx');
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      {/* Workspace Header */}
      <div className="border-b border-slate-200 pb-4 mb-6">
        <div className="flex items-center space-x-2 text-sm text-slate-500 mb-1.5">
          <span className="font-semibold text-[#4299e1]">SGCL Chartering</span>
          <span>/</span>
          <span>Phân hệ Sàng lọc &amp; Đánh giá Khách hàng</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">Tiếp nhận dữ liệu (Lead Ingestion)</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Không gian Tiếp nhận &amp; Thẩm định Khách hàng Tiềm năng
        </h2>
        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
          Nạp danh sách doanh nghiệp từ tệp Excel / CSV để hệ thống tự động bóc tách thực thể hàng hải, chấm điểm đa chiều và phân hạng theo tiêu chuẩn đội tàu SGCL.
        </p>
      </div>

      {/* Main Ingestion & Data Actions Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInputMain')?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-[#4299e1] bg-blue-50/50'
              : 'border-slate-300 hover:border-[#4299e1] hover:bg-slate-50/60'
          }`}
        >
          <input
            id="fileInputMain"
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileInput}
          />

          {isLoading ? (
            <div className="py-6 flex flex-col items-center space-y-3">
              <div className="w-7 h-7 border-2 border-slate-300 border-t-[#4299e1] rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-700">Đang phân tích cấu trúc dữ liệu tệp...</p>
            </div>
          ) : (
            <div className="py-2">
              <p className="text-base font-semibold text-slate-900 mb-1.5">
                Kéo thả tệp dữ liệu vào đây hoặc <span className="text-[#4299e1] underline">nhấp để chọn từ máy tính</span>
              </p>
              <p className="text-sm text-slate-500 mb-3">
                Hỗ trợ định dạng: <span className="font-semibold text-slate-700">.xlsx</span>, <span className="font-semibold text-slate-700">.xls</span>, <span className="font-semibold text-slate-700">.csv</span>
              </p>
              <div className="inline-flex items-center space-x-2 text-sm text-slate-600 bg-slate-100/80 px-3.5 py-1.5 rounded-md border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Tự động nhận diện cột tiếng Việt &amp; tiếng Anh (Mã KH, Doanh nghiệp, Mặt hàng, Tuyến cảng, Quy mô)</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            <strong className="font-semibold">Lỗi nạp tệp:</strong> {error}
          </div>
        )}

        {/* Action Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={onLoadSample}
            className="py-3 px-5 bg-[#4299e1] hover:bg-[#3182ce] text-white text-sm font-semibold rounded-lg shadow-xs transition cursor-pointer text-center"
          >
            Nạp 12 hồ sơ mẫu thực tế (Thử nghiệm nhanh)
          </button>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="py-3 px-5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg shadow-xs transition cursor-pointer text-center"
          >
            Tải biểu mẫu Excel chuẩn (.xlsx)
          </button>
        </div>
      </div>

      {/* Enterprise Maritime Qualification Specifications */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Quy chuẩn Thẩm định Đội tàu SGCL &amp; Phân hạng Khách hàng
            </h3>
            <p className="text-slate-500 text-sm mt-0.5">
              Căn cứ đối soát nhu cầu vận chuyển của khách hàng với năng lực cung ứng của phòng Chartering
            </p>
          </div>
          <span className="px-3 py-1 text-sm font-semibold bg-slate-100 text-slate-700 rounded-md border border-slate-200">
            Nghiệp vụ Môi giới SGCL
          </span>
        </div>

        {/* Specification Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5 border-r border-slate-200 w-48">Trụ cột đánh giá</th>
                <th className="py-2.5 px-3.5 border-r border-slate-200 w-28 text-center">Trọng số</th>
                <th className="py-2.5 px-3.5 border-r border-slate-200">Định mức nghiệp vụ đội tàu SGCL</th>
                <th className="py-2.5 px-3.5 w-44">Phân hệ dịch vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              <tr>
                <td className="py-2.5 px-3.5 font-semibold text-slate-800 border-r border-slate-200">
                  1. Mặt hàng (Commodity)
                </td>
                <td className="py-2.5 px-3.5 text-center font-mono font-bold text-slate-800 border-r border-slate-200">
                  40%
                </td>
                <td className="py-2.5 px-3.5 border-r border-slate-200">
                  Than đá, Clinker, Xi măng xá, Nông sản (ngô/đậu nành/gạo), Phân bón, Quặng, Thép, Thiết bị dự án OOG.
                </td>
                <td className="py-2.5 px-3.5 font-medium text-[#4299e1]">
                  Dry Bulk / Project Cargo
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-semibold text-slate-800 border-r border-slate-200">
                  2. Tuyến &amp; Cảng (POL &rarr; POD)
                </td>
                <td className="py-2.5 px-3.5 text-center font-mono font-bold text-slate-800 border-r border-slate-200">
                  35%
                </td>
                <td className="py-2.5 px-3.5 border-r border-slate-200">
                  Nội địa VN, Đông Nam Á (Indonesia, Malaysia, Thái Lan), Đông Á (Trung Quốc, Nhật Bản, Hàn Quốc), Ấn Độ, Trung Đông.
                </td>
                <td className="py-2.5 px-3.5 font-medium text-slate-700">
                  Mạng lưới &gt;90 chủ tàu
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-semibold text-slate-800 border-r border-slate-200">
                  3. Quy mô lô &amp; Cỡ tàu (Fit)
                </td>
                <td className="py-2.5 px-3.5 text-center font-mono font-bold text-slate-800 border-r border-slate-200">
                  25%
                </td>
                <td className="py-2.5 px-3.5 border-r border-slate-200">
                  Small Handy đến Supramax (3.000 &ndash; 55.000 DWT), tàu bách hóa đa năng (MPP) có cẩu tàu phù hợp hàng nặng.
                </td>
                <td className="py-2.5 px-3.5 font-medium text-slate-700">
                  Tàu rời &amp; Tàu bách hóa
                </td>
              </tr>
              <tr className="bg-red-50/50">
                <td className="py-2.5 px-3.5 font-semibold text-red-900 border-r border-slate-200">
                  Cổng loại trừ (Negative Gate)
                </td>
                <td className="py-2.5 px-3.5 text-center font-mono font-bold text-red-700 border-r border-slate-200">
                  -100đ
                </td>
                <td className="py-2.5 px-3.5 border-r border-slate-200 text-red-900">
                  Hàng container lẻ (LCL), bưu kiện thương mại điện tử, container lạnh (Reefer), xăng dầu hóa chất lỏng (Tanker).
                </td>
                <td className="py-2.5 px-3.5 font-semibold text-red-800">
                  Nhóm C (Loại trừ tự động)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Group Badges Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-lg">
            <span className="inline-block px-2.5 py-0.5 text-sm font-semibold bg-emerald-100 text-emerald-900 rounded mb-1">
              Nhóm A (&ge;70 điểm)
            </span>
            <p className="text-sm text-slate-700 mt-1 leading-relaxed">
              Khách hàng mục tiêu cốt lõi. Khớp hoàn toàn mặt hàng và dải tàu của SGCL, ưu tiên phân công Broker tiếp cận ngay.
            </p>
          </div>
          <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-lg">
            <span className="inline-block px-2.5 py-0.5 text-sm font-semibold bg-amber-100 text-amber-900 rounded mb-1">
              Nhóm B (50 &ndash; 69 điểm)
            </span>
            <p className="text-sm text-slate-700 mt-1 leading-relaxed">
              Khách hàng tiềm năng theo dõi. Cần kiểm tra ngày sẵn sàng hàng (Laycan) hoặc gom lô kết hợp để khớp cỡ tàu.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="inline-block px-2.5 py-0.5 text-sm font-semibold bg-slate-200 text-slate-700 rounded mb-1">
              Nhóm C (&lt;50 điểm)
            </span>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Đối tượng loại trừ. Không phù hợp phương thức khai thác tàu rời / dự án của SGCL, lưu hồ sơ đối chứng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
