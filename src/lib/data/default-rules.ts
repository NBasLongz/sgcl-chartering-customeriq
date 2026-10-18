import { ScoringRules } from '../types/rules';

export const DEFAULT_RULES: ScoringRules = {
  weightCargo: 50,
  weightRoute: 30,
  weightVolume: 20,
  thresholdA: 80,
  thresholdB: 55,
  dataMasking: true,
  bulkKeywords: [
    "than đá", "than nhập khẩu", "coal", "clinker", "xi măng", "đá vôi",
    "thạch cao", "phân bón", "ure", "kali", "gạo", "nông sản", "ngũ cốc", "vật liệu xây dựng"
  ],
  projectKeywords: [
    "thép", "kết cấu thép", "điện gió", "thiết bị", "máy công trình",
    "cơ giới", "oog", "heavy-lift", "breakbulk", "dự án"
  ],
  negativeKeywords: [
    "container lạnh", "reefer", "cấp đông", "lcl", "đóng túi", "siêu thị",
    "chuyển phát nhanh", "bưu phẩm", "e-commerce", "hàng không",
    "hóa chất lỏng", "dung môi", "xăng dầu", "tanker", "teu"
  ]
};
