import * as XLSX from 'xlsx';
import { RawLead, EvaluatedLead } from '../types/lead';
import { sanitizeSensitiveText } from './data-masking';

export function normalizeColumnName(name: string): string {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function findRowValue(row: Record<string, unknown>, normalizedKeys: string[], fallback = ''): string {
  const keys = Object.keys(row);
  for (const k of keys) {
    const norm = normalizeColumnName(k);
    if (normalizedKeys.includes(norm)) {
      const val = String(row[k] ?? '').trim();
      if (val) return val;
    }
  }
  return fallback;
}

const companyAliases = ['tencongty', 'doanhnghiep', 'tendoanhnghiep', 'tenkhachhang', 'tenkh', 'congty', 'company', 'customername', 'cty', 'donvi'];
const cargoAliases = ['mathang', 'mathangkinhdoanh', 'sanpham', 'nganhnghe', 'hanghoa', 'linhvuc', 'linhvuckinhdoanh', 'commodities', 'commodity', 'product', 'loaihang'];
const routeAliases = ['tuyen', 'tuyenvanchuyen', 'tuyenduong', 'cang', 'polpod', 'thitruong', 'khuvuc', 'tradelane', 'tradelanes', 'cangdi', 'cangden', 'route'];
const volumeAliases = ['sanluong', 'quymo', 'khoiluong', 'soluong', 'trongluong', 'volume', 'estimatedvolume', 'capacity', 'tan', 'cbm', 'mt'];
const roleAliases = ['vaitro', 'role', 'loaihinh', 'chucnang', 'type', 'vitri'];
const sourceAliases = ['nguon', 'nguonthuthap', 'source', 'kenh'];
const idAliases = ['makh', 'id', 'mst', 'masothue', 'stt', 'code'];

export async function parseExcelFile(
  file: File,
  replaceExisting: boolean,
  currentCount: number,
  dataMasking: boolean = true
): Promise<RawLead[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('File không chứa trang tính (sheet) nào hợp lệ.');
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  if (!rows || rows.length === 0) {
    throw new Error('Không tìm thấy dòng dữ liệu nào trong trang tính đầu tiên.');
  }

  const importedLeads: RawLead[] = [];

  rows.forEach((r, idx) => {
    const company = sanitizeSensitiveText(findRowValue(r, companyAliases, ''), dataMasking);
    const cargo = sanitizeSensitiveText(findRowValue(r, cargoAliases, ''), dataMasking);
    const route = findRowValue(r, routeAliases, 'Nội vùng / Chưa xác định cảng');
    const volume = findRowValue(r, volumeAliases, 'Theo lô tàu chuyến');
    const role = findRowValue(r, roleAliases, 'Shipper / Charterer');
    const source = findRowValue(r, sourceAliases, file.name);
    const customId = findRowValue(r, idAliases, '');

    if (company || cargo) {
      const baseNumber = replaceExisting
        ? 2501 + idx
        : 2500 + currentCount + importedLeads.length + 1;

      importedLeads.push({
        id: customId || `SG-${baseNumber}`,
        company: company || `Doanh nghiệp #${idx + 1}`,
        role,
        source,
        cargo: cargo || 'Chưa khai báo mặt hàng',
        volume,
        route,
        status: 'Cần Broker kiểm tra lại',
        manualGroup: 'AUTO',
        note: ''
      });
    }
  });

  if (importedLeads.length === 0) {
    throw new Error('Không nhận diện được cột dữ liệu hợp lệ. Cần ít nhất 1 cột chứa Tên công ty hoặc Mặt hàng.');
  }

  return importedLeads;
}

export function exportQualifiedLeadsToExcel(leads: EvaluatedLead[]): void {
  const suitable = leads.filter(l => l.group === 'A' || l.group === 'B');
  if (suitable.length === 0) {
    throw new Error('Không có hồ sơ nào thuộc Nhóm A hoặc Nhóm B để xuất file.');
  }

  const exportRows = suitable.map(l => ({
    'Mã KH': l.id,
    'Tên Doanh nghiệp': l.company,
    'Vai trò': l.role,
    'Nguồn thu thập': l.source,
    'Mặt hàng': l.cargo,
    'Quy mô lô hàng': l.volume,
    'Tuyến vận chuyển (POL -> POD)': l.route,
    'Bộ phận SGCL': l.service,
    'Gợi ý cỡ tàu': l.vesselFit,
    'Điểm mặt hàng': l.scoreCargo,
    'Điểm tuyến cảng': l.scoreRoute,
    'Điểm quy mô lô': l.scoreVolume,
    'Tổng điểm (/100)': l.score,
    'Phân nhóm': `Nhóm ${l.group}`,
    'Thuyết minh phân loại': l.reason,
    'Trạng thái thẩm định': l.status,
    'Ghi chú Broker': l.note || ''
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'KhachHang_DatTieuChi_SGCL');
  XLSX.writeFile(wb, `SGCL_DS_KhachHang_PhuHop_${suitable.length}DN.xlsx`);
}

export function downloadSampleExcelTemplate(): void {
  const sampleRows = [
    {
      'Tên công ty': 'Công ty CP Xi măng Nghi Sơn',
      'Vai trò': 'Shipper / Charterer',
      'Nguồn': 'Hiệp hội VSA',
      'Mặt hàng': 'Clinker & Đá vôi xá',
      'Sản lượng': '22.000 MT / chuyến',
      'Tuyến': 'Nghi Sơn → Chittagong'
    },
    {
      'Tên công ty': 'Công ty TNHH Thép & Kết cấu Hòa Phát Dung Quất',
      'Vai trò': 'Shipper',
      'Nguồn': 'Cổng Hải quan',
      'Mặt hàng': 'Thép cuộn & Kết cấu thép',
      'Sản lượng': '12.000 MT',
      'Tuyến': 'Dung Quất → Antwerp'
    },
    {
      'Tên công ty': 'Công ty CP Nông sản Thực phẩm Trung Nam',
      'Vai trò': 'Trader',
      'Nguồn': 'Danh bạ B2B',
      'Mặt hàng': 'Gạo bao & Nông sản xuất khẩu',
      'Sản lượng': '5.000 MT (Theo mùa vụ)',
      'Tuyến': 'TP.HCM → Singapore'
    },
    {
      'Tên công ty': 'Công ty CP Giao nhận Hàng không & Chuyển phát Nhanh',
      'Vai trò': 'Forwarder',
      'Nguồn': 'Website',
      'Mặt hàng': 'Bưu phẩm E-commerce & Hàng lẻ LCL',
      'Sản lượng': '1 TEU / tháng',
      'Tuyến': 'Nội Á'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Mau_Nhap_KhachHang_SGCL');
  XLSX.writeFile(wb, 'SGCL_File_Mau_Khach_Hang_Tho.xlsx');
}
