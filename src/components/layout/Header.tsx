'use client';

interface HeaderProps {
  onOpenKpiModal: () => void;
  onOpenBenchmarkModal: () => void;
}

export default function Header({ onOpenKpiModal, onOpenBenchmarkModal }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 h-12 flex items-center justify-between sticky top-0 z-30 shrink-0">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="bg-[#0F3D75] text-white font-bold px-2.5 py-0.5 text-xs rounded tracking-wider uppercase">
            SGCL
          </span>
          <span className="text-xs font-semibold text-slate-800 tracking-tight">
            Saigon Cuulong JSC
          </span>
        </div>
        <span className="text-slate-300">|</span>
        <h1 className="text-xs font-medium text-slate-600 truncate hidden sm:inline-block">
          Phân hệ Sàng lọc &amp; Đánh giá Khách hàng Môi giới Tàu biển (Chartering Qualification)
        </h1>
      </div>

      <div className="flex items-center space-x-4 text-xs">
        <button
          type="button"
          onClick={onOpenKpiModal}
          className="text-slate-700 hover:text-[#0F3D75] font-medium underline decoration-slate-300 underline-offset-4 transition hidden md:inline-block cursor-pointer"
          title="Xem báo cáo đo lường thời gian tiết kiệm, độ chính xác và kiểm soát rủi ro"
        >
          Báo cáo Hiệu suất &amp; KPIs
        </button>
        <span className="text-slate-300 hidden md:inline">|</span>
        <button
          type="button"
          onClick={onOpenBenchmarkModal}
          className="text-slate-600 hover:text-[#0F3D75] underline decoration-slate-300 underline-offset-4 transition hidden sm:inline-block cursor-pointer"
          title="Xem bảng đối chiếu số liệu thực tế năm 2024 - 2025 của phòng Chartering"
        >
          Số liệu Thực tế 2024–2025
        </button>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <div className="flex items-center space-x-2 text-slate-700">
          <span
            className="w-2 h-2 rounded-full bg-emerald-600"
            aria-hidden="true"
            title="Hệ thống vận hành sẵn sàng"
          ></span>
          <span className="font-medium text-slate-700">Bộ phận Chartering</span>
        </div>
      </div>
    </header>
  );
}
