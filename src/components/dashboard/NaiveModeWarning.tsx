'use client';

import { EngineMode } from '@/lib/types/rules';

interface NaiveModeWarningProps {
  engineMode: EngineMode;
  onSwitchToContext: () => void;
}

export default function NaiveModeWarning({
  engineMode,
  onSwitchToContext
}: NaiveModeWarningProps) {
  if (engineMode !== 'NAIVE_KEYWORD') return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 lg:px-6 py-2 text-xs text-amber-900 flex items-center justify-between">
      <div>
        <strong>Chế độ đối chứng (Quét từ khóa đơn):</strong> Hệ thống chỉ quét sự xuất hiện của từ khóa mặt hàng mà bỏ qua ngữ cảnh đóng gói lẻ/phương thức vận tải. Lưu ý hồ sơ <code className="font-mono font-bold">SG-2509</code> (Nông sản đóng túi 500g đi LCL) bị phân loại nhầm vào Nhóm A.
      </div>
      <button
        type="button"
        onClick={onSwitchToContext}
        className="ml-4 px-3 py-1 bg-amber-800 text-white text-xs font-semibold rounded-md shrink-0 hover:bg-amber-900 transition cursor-pointer"
      >
        Chuyển về Phân tích Ngữ cảnh
      </button>
    </div>
  );
}
