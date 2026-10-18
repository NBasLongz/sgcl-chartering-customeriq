import { RawLead } from '../types/lead';

export const DEFAULT_RAW_LEADS: RawLead[] = [
  {
    id: "SG-2501",
    company: "Công ty CP Xi măng & VLXD Miền Nam",
    role: "Shipper / Charterer",
    source: "Hiệp hội VSA",
    cargo: "Clinker & Đá vôi xá",
    volume: "17.000 MT / chuyến",
    route: "Pasir Gudang → Mumbai",
    status: "Đã duyệt tiếp cận",
    manualGroup: "AUTO",
    note: "Lịch xuất hàng đều hàng quý, ưu tiên tàu Handysize/Supramax có cẩu."
  },
  {
    id: "SG-2502",
    company: "Công ty TNHH Kết cấu Thép & Cơ khí Phú Mỹ",
    role: "Shipper",
    source: "Cổng Hải quan",
    cargo: "Sản phẩm Thép & Kết cấu thép",
    volume: "3.280 CBM",
    route: "Phú Mỹ → Durban",
    status: "Đã duyệt tiếp cận",
    manualGroup: "AUTO",
    note: "Tuyến Nam Phi thực tế SGCL đã khai thác năm 2025."
  },
  {
    id: "SG-2503",
    company: "Tập đoàn Năng lượng Tái tạo Đông Á",
    role: "Charterer",
    source: "Hội nghị VLA",
    cargo: "Thiết bị điện gió (OOG / Heavy-lift)",
    volume: "2.418 CBM",
    route: "Laem Chabang → Chennai",
    status: "Giao Senior Broker",
    manualGroup: "AUTO",
    note: "Yêu cầu tàu MPP có cần cẩu ghép đôi >= 120 MT."
  },
  {
    id: "SG-2504",
    company: "Công ty XNK Nông sản & Lương thực Cửu Long",
    role: "Trader / Shipper",
    source: "Danh bạ B2B",
    cargo: "Gạo xuất khẩu & Phân bón đóng bao",
    volume: "2.990 CBM – 7.000 MT (Theo mùa vụ)",
    route: "Hồ Chí Minh → Jurong",
    status: "Đưa vào lịch chăm sóc",
    manualGroup: "AUTO",
    note: "Sản lượng biến động theo vụ mùa, cần gửi báo cáo cước định kỳ."
  },
  {
    id: "SG-2505",
    company: "Công ty CP Thực phẩm Đông lạnh Hải Việt",
    role: "Shipper",
    source: "Danh bạ XNK",
    cargo: "Thủy sản cấp đông (Container lạnh Reefer)",
    volume: "2 - 3 TEU / tuần",
    route: "Cát Lái → Yokohama",
    status: "Đã loại trừ",
    manualGroup: "AUTO",
    note: ""
  },
  {
    id: "SG-2506",
    company: "Công ty TNHH Chuyển phát nhanh & Bưu chính Quốc tế",
    role: "Forwarder",
    source: "Website",
    cargo: "Bưu phẩm, hàng tiêu dùng E-commerce",
    volume: "Vận tải hàng không & đường bộ",
    route: "Nội địa & Nội Á",
    status: "Đã loại trừ",
    manualGroup: "AUTO",
    note: ""
  },
  {
    id: "SG-2507",
    company: "Công ty CP Nhiệt điện & Khoáng sản Thịnh Phát",
    role: "Charterer",
    source: "Đối tác giới thiệu",
    cargo: "Than đá nhập khẩu & Thạch cao",
    volume: "25.000 MT / chuyến (COA)",
    route: "Kalimantan → Vĩnh Tân",
    status: "Đã duyệt tiếp cận",
    manualGroup: "AUTO",
    note: "Khách hàng mục tiêu hợp đồng bao (COA) tàu Supramax."
  },
  {
    id: "SG-2508",
    company: "Công ty TNHH Cơ giới & Thiết bị Công trình Hàn Việt",
    role: "Shipper",
    source: "Hiệp hội VPA",
    cargo: "Thiết bị làm đất & Máy công trình",
    volume: "295 CBM",
    route: "Laem Chabang → Busan",
    status: "Đã duyệt tiếp cận",
    manualGroup: "AUTO",
    note: "Ghép hàng part-cargo trên tuyến Đông Nam Á - Hàn Quốc."
  },
  {
    id: "SG-2509",
    company: "Công ty CP Thương mại Tổng hợp Hòa Bình",
    role: "Trader",
    source: "Cổng thông tin QG",
    cargo: "Nông sản sấy khô đóng túi 500g siêu thị",
    volume: "1 Container LCL / tháng",
    route: "Hải Phòng → Hồng Kông",
    status: "Đã loại trừ",
    manualGroup: "AUTO",
    note: "Trường hợp kiểm thử điển hình: có từ khóa 'nông sản' nhưng đi LCL đóng gói nhỏ lẻ."
  },
  {
    id: "SG-2510",
    company: "Công ty CP Hóa chất & Xăng dầu Đại Dương",
    role: "Shipper",
    source: "Danh bạ Hải quan",
    cargo: "Hóa chất lỏng & Dung môi công nghiệp",
    volume: "3.000 MT (Tàu Chemical Tanker)",
    route: "Dung Quất → Singapore",
    status: "Đã loại trừ",
    manualGroup: "AUTO",
    note: ""
  },
  {
    id: "SG-2511",
    company: "Công ty TNHH Phân bón & Hóa chất Nông nghiệp Miền Tây",
    role: "Charterer",
    source: "Khách hàng cũ giới thiệu",
    cargo: "Phân bón Ure & Kali đổ xá",
    volume: "7.000 MT / chuyến",
    route: "Pasir Gudang → TP. Hồ Chí Minh",
    status: "Giao Senior Broker",
    manualGroup: "AUTO",
    note: "Khớp cỡ tàu Small Handy tuyến Malaysia - Việt Nam."
  },
  {
    id: "SG-2512",
    company: "Công ty CP Xuất nhập khẩu Vật tư Tổng hợp Nam Việt",
    role: "Trader",
    source: "Hội chợ Logistics",
    cargo: "Vật liệu xây dựng & Hàng bách hóa",
    volume: "3.500 - 5.000 MT (Tùy kỳ)",
    route: "Nội vùng Đông Nam Á",
    status: "Đưa vào lịch chăm sóc",
    manualGroup: "AUTO",
    note: "Chưa có Laycan cố định trong quý này."
  }
];
