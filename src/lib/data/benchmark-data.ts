import { HistoricalBenchmarkItem } from '../types/kpi';

export const BENCHMARK_METRICS: HistoricalBenchmarkItem[] = [
  {
    criterion: 'Khách hàng, đối tác mới',
    unit: 'Đối tượng',
    year2024: '18',
    year2025: '22',
    changePct: '+22,22%'
  },
  {
    criterion: 'Khách hàng, đối tác quay lại',
    unit: 'Đối tượng',
    year2024: '72',
    year2025: '78',
    changePct: '+8,33%'
  },
  {
    criterion: '1. Số lượng đối tượng được tìm kiếm',
    unit: 'Đối tượng',
    year2024: '290',
    year2025: '350',
    changePct: '+20,69%',
    highlight: true
  },
  {
    criterion: '2. Số lượng đối tượng phù hợp (Nhóm A & B)',
    unit: 'Đối tượng',
    year2024: '150 (51,72%)',
    year2025: '180 (51,43%)',
    changePct: '+20,00%',
    highlight: true
  },
  {
    criterion: '3. Số lượng đối tượng được tiếp cận',
    unit: 'Đối tượng',
    year2024: '120',
    year2025: '155',
    changePct: '+29,17%'
  },
  {
    criterion: '4. Đối tượng phản hồi & phát sinh nhu cầu',
    unit: 'Đối tượng',
    year2024: '52',
    year2025: '65',
    changePct: '+25,00%'
  },
  {
    criterion: '5. Số lượng cơ hội môi giới',
    unit: 'Cơ hội',
    year2024: '70',
    year2025: '85',
    changePct: '+21,43%'
  },
  {
    criterion: '6. Giao dịch môi giới thành công (Fixtures)',
    unit: 'Giao dịch',
    year2024: '87',
    year2025: '120',
    changePct: '+37,93%'
  },
  {
    criterion: '7. Phí môi giới bình quân',
    unit: 'USD / GD',
    year2024: '4.000 – 5.500',
    year2025: '4.000 – 6.500',
    changePct: '+18,18% (trần)'
  }
];
