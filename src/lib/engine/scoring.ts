import { RawLead, EvaluatedLead, ServiceType, LeadGroup } from '../types/lead';
import { ScoringRules, EngineMode } from '../types/rules';

export function evaluateLead(
  rawLead: RawLead,
  rules: ScoringRules,
  engineMode: EngineMode = 'CONTEXT_MATRIX'
): EvaluatedLead {
  const cargoText = `${rawLead.cargo} ${rawLead.company}`.toLowerCase();
  const volumeText = `${rawLead.volume} ${rawLead.cargo}`.toLowerCase();
  const routeText = `${rawLead.route}`.toLowerCase();
  const fullText = `${rawLead.company} ${rawLead.cargo} ${rawLead.volume} ${rawLead.route}`.toLowerCase();

  const wCargo = rules.weightCargo;
  const wRoute = rules.weightRoute;
  const wVolume = rules.weightVolume;

  // 1. Evaluate Commodity Match
  const matchedProject = rules.projectKeywords.filter(k => k && cargoText.includes(k.toLowerCase().trim()));
  const matchedBulk = rules.bulkKeywords.filter(k => k && cargoText.includes(k.toLowerCase().trim()));
  const matchedNeg = rules.negativeKeywords.filter(k => k && fullText.includes(k.toLowerCase().trim()));

  let cargoRatio = 0.25;
  let service: ServiceType = 'Dry Bulk Chartering';
  let vesselFit = 'Small Handy / Handysize (3.000 – 25.000 DWT)';

  if (matchedProject.length > 0) {
    cargoRatio = 1.0;
    service = 'Project / Breakbulk';
    vesselFit = 'Tàu MPP / Heavy-lift / Tween-decker có cẩu';
  } else if (matchedBulk.length > 0) {
    if (
      cargoText.includes('tổng hợp') ||
      cargoText.includes('bách hóa') ||
      volumeText.includes('tùy kỳ') ||
      volumeText.includes('mùa vụ')
    ) {
      cargoRatio = 0.8;
    } else {
      cargoRatio = 1.0;
    }
    service = 'Dry Bulk Chartering';
  }

  // 2. Evaluate Trade Lane (POL -> POD)
  const coreRoutes = [
    'pasir gudang', 'mumbai', 'phú mỹ', 'durban', 'laem chabang',
    'chennai', 'hồ chí minh', 'jurong', 'kalimantan', 'vĩnh tân',
    'busan', 'nghi sơn', 'chittagong', 'cẩm phả', 'ấn độ'
  ];
  const regionalRoutes = [
    'đông nam á', 'đông á', 'nam á', 'trung đông', 'singapore', 'hải phòng', 'hồng kông'
  ];

  let routeRatio = 0.4;
  let routeNote = 'Tuyến vận chuyển chưa xác định cảng cụ thể; cần xác minh thêm.';
  if (coreRoutes.some(r => routeText.includes(r))) {
    routeRatio = 0.95;
    routeNote = `Tuyến cảng (${rawLead.route}) nằm trong mạng lưới trọng điểm của hơn 90 chủ tàu đối tác SGCL.`;
  } else if (regionalRoutes.some(r => routeText.includes(r))) {
    routeRatio = 0.78;
    routeNote = `Khu vực (${rawLead.route}) thuộc phạm vi khai thác thường xuyên của đội tàu khu vực.`;
  }

  // 3. Evaluate Cargo Volume & Vessel Suitability
  let volumeRatio = 0.45;
  const mtMatch = volumeText.match(/(\d+[\.,]?\d*)\s*(mt|tấn|tan)/i);
  const cbmMatch = volumeText.match(/(\d+[\.,]?\d*)\s*(cbm|khối|khoi|m3)/i);

  if (mtMatch) {
    const mtVal = parseFloat(mtMatch[1].replace(/\./g, '').replace(',', '.'));
    if (mtVal >= 15000) {
      volumeRatio = 0.96;
      vesselFit = 'Handysize / Supramax (15.000 – 55.000 DWT)';
    } else if (mtVal >= 5000) {
      volumeRatio = 0.88;
      vesselFit = 'Small Handy / Handysize (5.000 – 15.000 DWT)';
    } else {
      volumeRatio = 0.65;
      vesselFit = 'Small Handy / Coaster (3.000 – 5.000 DWT)';
    }
  } else if (cbmMatch) {
    const cbmVal = parseFloat(cbmMatch[1].replace(/\./g, '').replace(',', '.'));
    if (cbmVal >= 1500) {
      volumeRatio = 0.92;
      vesselFit = 'Tàu MPP / Heavy-lift nguyên chuyến hoặc Part-cargo lớn';
    } else {
      volumeRatio = 0.8;
      vesselFit = 'Part-cargo tàu MPP / Breakbulk định tuyến';
    }
  }

  if (volumeText.includes('tùy kỳ') || volumeText.includes('mùa vụ')) {
    volumeRatio = Math.min(volumeRatio, 0.55);
  }

  const scoreCargo = Math.round(wCargo * cargoRatio);
  const scoreRoute = Math.round(wRoute * routeRatio);
  const scoreVolume = Math.round(wVolume * volumeRatio);
  let rawScore = scoreCargo + scoreRoute + scoreVolume;
  let penalty = 0;
  let reason = '';
  let xaiSteps: string[] = [];
  let autoGroup: LeadGroup = 'B';

  if (engineMode === 'CONTEXT_MATRIX' && matchedNeg.length > 0) {
    penalty = Math.max(0, rawScore - 12);
    rawScore = Math.max(5, rawScore - penalty);
    autoGroup = 'C';
    service = 'Không thuộc phạm vi';
    vesselFit = 'Không áp dụng (Ngoài dải tàu hàng rời/MPP)';
    if (matchedBulk.length > 0 || matchedProject.length > 0) {
      reason = `Loại trừ theo ngữ cảnh: Tuy có từ khóa '${matchedBulk[0] || matchedProject[0]}' nhưng đi kèm thuộc tính cấm (${matchedNeg.join(', ')}).`;
    } else {
      reason = `Loại trừ tự động: Phát hiện phương thức/mặt hàng ngoài phạm vi (${matchedNeg.join(', ')}).`;
    }
    xaiSteps = [
      `<strong>1. Bóc tách mặt hàng:</strong> Ghi nhận mô tả <em>"${rawLead.cargo}"</em>.`,
      `<strong>2. Phân tích ngữ cảnh (Negative Gate):</strong> Phát hiện từ khóa loại trừ <code class="text-red-700 font-semibold">${matchedNeg.join(', ')}</code> (hàng đóng gói lẻ/container lạnh/tàu dầu).`,
      `<strong>3. Đối chiếu đội tàu SGCL:</strong> Không tương thích với đội tàu hàng rời khô (Dry Bulk) và tàu dự án (MPP). Hệ thống phạt trừ ${penalty} điểm.`,
      `<strong>4. Đề xuất hành động:</strong> Loại trừ tự động (Nhóm C). Không phân bổ cho Broker gọi điện để tiết kiệm thời gian.`
    ];
  } else if (
    engineMode === 'NAIVE_KEYWORD' &&
    matchedNeg.length > 0 &&
    (matchedBulk.length > 0 || matchedProject.length > 0)
  ) {
    rawScore = Math.max(rules.thresholdA + 2, rawScore);
    autoGroup = 'A';
    reason = `[Bắt nhầm do quét từ khóa đơn]: Bắt trúng từ khóa '${matchedBulk[0] || matchedProject[0]}' nhưng bỏ qua ngữ cảnh '${matchedNeg.join(', ')}'.`;
    xaiSteps = [
      `<strong>1. Quét từ khóa đơn (Regex cũ):</strong> Bắt trúng từ khóa <code class="text-emerald-700 font-semibold">${matchedBulk[0] || matchedProject[0]}</code> và cộng tối đa điểm mặt hàng.`,
      `<strong>2. Lỗi mù ngữ cảnh (False Positive):</strong> Thuật toán cũ bỏ qua thuộc tính <code class="text-red-700 font-semibold">${matchedNeg.join(', ')}</code> đi kèm trong câu.`,
      `<strong>3. Hệ quả nghiệp vụ:</strong> Xếp nhầm khách hàng đi hàng lẻ siêu thị vào Nhóm A, làm Broker mất thời gian liên hệ vô ích.`,
      `<strong>4. Khắc phục:</strong> Chuyển sang chế độ <em>Phân tích Ngữ cảnh Đa chiều</em> để loại trừ chính xác.`
    ];
  } else if (matchedNeg.length > 0) {
    penalty = Math.max(0, rawScore - 10);
    rawScore = 10;
    autoGroup = 'C';
    service = 'Không thuộc phạm vi';
    vesselFit = 'Không áp dụng';
    reason = `Loại trừ: Mặt hàng/phương thức (${matchedNeg.join(', ')}) không thuộc phạm vi tàu hàng rời.`;
    xaiSteps = [
      `<strong>1. Bóc tách mặt hàng:</strong> Ghi nhận <em>"${rawLead.cargo}"</em>.`,
      `<strong>2. Kiểm tra điều kiện cấm:</strong> Vi phạm tiêu chí loại trừ (${matchedNeg.join(', ')}).`,
      `<strong>3. Đối chiếu đội tàu:</strong> Ngoài năng lực khai thác của bộ phận Chartering.`,
      `<strong>4. Đề xuất hành động:</strong> Đưa vào Nhóm C (Loại bỏ).`
    ];
  } else {
    if (rawScore >= rules.thresholdA) {
      autoGroup = 'A';
      if (service === 'Project / Breakbulk') {
        reason = `Khớp tiêu chí hàng dự án/Breakbulk (${matchedProject.slice(0, 2).join(', ')}) và tuyến khai thác ${rawLead.route}.`;
      } else {
        reason = `Khớp mặt hàng rời khô thế mạnh (${matchedBulk.slice(0, 2).join(', ')}), quy mô phù hợp cỡ tàu ${vesselFit.split('(')[0].trim()}.`;
      }
      xaiSteps = [
        `<strong>1. Độ khớp Mặt hàng (${scoreCargo}/${wCargo}đ):</strong> Khớp trực tiếp nhóm hàng mục tiêu (${matchedProject[0] || matchedBulk[0] || rawLead.cargo}) thuộc phân hệ <strong>${service}</strong>.`,
        `<strong>2. Tuyến &amp; Cảng (${scoreRoute}/${wRoute}đ):</strong> ${routeNote}`,
        `<strong>3. Quy mô &amp; Cỡ tàu (${scoreVolume}/${wVolume}đ):</strong> Lô hàng <em>${rawLead.volume}</em> tương thích hoàn toàn với cỡ tàu <strong>${vesselFit}</strong>.`,
        `<strong>4. Đề xuất hành động:</strong> Xếp hạng <strong>Nhóm A</strong>. Giao Broker liên hệ ngay trong 24h để nắm Laycan và chào lịch tàu trống.`
      ];
    } else if (rawScore >= rules.thresholdB) {
      autoGroup = 'B';
      reason = 'Khớp nhóm ngành hàng rời/bách hóa nhưng sản lượng biến động theo mùa vụ hoặc cần xác minh thêm Laycan.';
      xaiSteps = [
        `<strong>1. Độ khớp Mặt hàng (${scoreCargo}/${wCargo}đ):</strong> Có liên quan đến vận chuyển hàng rời/bách hóa (${rawLead.cargo}).`,
        `<strong>2. Tuyến &amp; Cảng (${scoreRoute}/${wRoute}đ):</strong> ${routeNote}`,
        `<strong>3. Quy mô &amp; Lịch trình (${scoreVolume}/${wVolume}đ):</strong> Lô hàng <em>${rawLead.volume}</em> có tính chất mùa vụ/tùy kỳ, điểm quy mô ở mức trung bình.`,
        `<strong>4. Đề xuất hành động:</strong> Xếp hạng <strong>Nhóm B (Tiềm năng theo dõi)</strong>. Đưa vào danh sách gửi Bản tin thị trường cước (Market Report) định kỳ.`
      ];
    } else {
      autoGroup = 'C';
      service = 'Không thuộc phạm vi';
      reason = 'Tổng điểm tương thích thấp hơn ngưỡng tiêu chuẩn của bộ phận Chartering.';
      xaiSteps = [
        `<strong>1. Độ khớp Mặt hàng (${scoreCargo}/${wCargo}đ):</strong> Chưa rõ mặt hàng tàu chuyến mục tiêu.`,
        `<strong>2. Tuyến &amp; Cảng (${scoreRoute}/${wRoute}đ):</strong> ${routeNote}`,
        `<strong>3. Quy mô lô (${scoreVolume}/${wVolume}đ):</strong> Không đủ dữ liệu khối lượng tàu rời.`,
        `<strong>4. Đề xuất hành động:</strong> Xếp vào Nhóm C.`
      ];
    }
  }

  const finalGroup: LeadGroup =
    rawLead.manualGroup && rawLead.manualGroup !== 'AUTO'
      ? rawLead.manualGroup
      : autoGroup;

  let status = rawLead.status;
  if (
    engineMode === 'NAIVE_KEYWORD' &&
    matchedNeg.length > 0 &&
    (matchedBulk.length > 0 || matchedProject.length > 0)
  ) {
    status = 'Cần Broker kiểm tra lại';
  } else if (
    engineMode === 'CONTEXT_MATRIX' &&
    rawLead.id === 'SG-2509' &&
    status === 'Cần Broker kiểm tra lại'
  ) {
    status = 'Đã loại trừ';
  }

  return {
    ...rawLead,
    score: Math.min(100, Math.max(0, rawScore)),
    scoreCargo,
    scoreRoute,
    scoreVolume,
    penalty,
    autoGroup,
    group: finalGroup,
    service,
    vesselFit,
    reason,
    xaiSteps,
    status
  };
}
