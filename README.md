# SGCL Chartering — Hệ thống Sàng lọc & Phân loại Khách hàng Hàng hải (CustomerIQ)

> **Dự án Chuẩn hóa & Phân rã Hệ thống Hỗ trợ Môi giới Tàu biển (Chartering Lead Qualification System)**  
> **Đơn vị ứng dụng:** Công ty Cổ phần Dịch vụ Tiếp vận và Thương mại Sài Gòn Cửu Long (Saigon Cuulong JSC - SGCL)  
> **Công nghệ:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, SheetJS (`xlsx`), Serverless Functions, Sẵn sàng triển khai tức thì lên **Vercel**.

---

## 1. TỔNG QUAN DỰ ÁN

Hệ thống được phát triển nhằm giải quyết triệt để các nút thắt trong công tác tìm kiếm, thẩm định và tiếp cận khách hàng tiềm năng tại Bộ phận Thuê tàu & Môi giới Hàng hải (Chartering Department) của SGCL:

1. **Khắc phục tình trạng "Mù ngữ cảnh / False Positive":** Ngăn chặn lỗi xếp nhầm hàng đóng gói lẻ siêu thị/LCL/container lạnh vào nhóm tàu chuyến nhờ bộ lọc điều kiện cấm (**Negative Gate**).
2. **Minh bạch hóa quyết định (Explainable AI - XAI 4 bước):** Bóc tách thực thể hàng hải (NER), đối chiếu dải cỡ tàu SGCL (Small Handy đến Supramax 3.000 – 55.000 DWT, tàu MPP/Project có cẩu) và sinh thuyết minh lý giải cụ thể.
3. **Cầu nối Sàng lọc $\rightarrow$ Tiếp cận (Outreach Draft):** Tự động sinh bản thảo Email chào cước và kịch bản hỏi hàng chuẩn nghiệp vụ Baltic/BIMCO.
4. **Đo lường Định lượng (KPIs & ROI):** Tự động hạch toán số giờ công và tỷ lệ tiết kiệm thời gian cho Broker (giảm trên 80% thời gian rà soát).
5. **Bảo mật Dữ liệu Thương mại (Data Masking):** Ẩn danh số điện thoại, email cá nhân trước khi xử lý, tuân thủ Mục 3.5.2 của Báo cáo.

---

## 2. CẤU TRÚC PHÂN RÃ HỆ THỐNG (MODULAR ARCHITECTURE)

Dự án đã được phân rã hoàn toàn từ file đơn thành kiến trúc module chuẩn công nghiệp:

```
CustomerIQ/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── screen-leads/route.ts      # Serverless API: Batch screening + Gemini Flash API + Fallback
│   │   │   ├── generate-outreach/route.ts # Serverless API: Sinh email tiếp cận cá nhân hóa
│   │   │   └── health/route.ts            # Endpoint kiểm tra trạng thái hệ thống
│   │   ├── globals.css                    # Design token, font chữ, scrollbar, animation
│   │   ├── layout.tsx                     # Root layout, metadata SEO, font Inter & JetBrains Mono
│   │   └── page.tsx                       # Dashboard chính tích hợp toàn bộ các module
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx                 # Thanh tiêu đề, logo SGCL, trigger mở KPI/Benchmark
│   │   │   └── Sidebar.tsx                # Danh mục sàng lọc, counter động, cấu hình trọng số
│   │   ├── dashboard/
│   │   │   ├── MetricsBar.tsx             # 6 thẻ KPI (Tổng hồ sơ, Đạt %, Nhóm A, B, C, Giờ tiết kiệm)
│   │   │   ├── FilterBar.tsx              # Bộ lọc tìm kiếm, phân nhóm, nghiệp vụ, trạng thái, cơ chế AI
│   │   │   ├── NaiveModeWarning.tsx       # Cảnh báo đối chứng chế độ quét từ khóa đơn
│   │   │   ├── LeadTable.tsx              # Bảng dữ liệu khách hàng, phân trang, sắp xếp, duyệt trạng thái
│   │   │   └── Pagination.tsx             # Điều khiển phân trang & chọn số dòng/trang
│   │   ├── inspection/
│   │   │   └── InspectionDrawer.tsx       # Bảng trượt kiểm tra: XAI 4 bước, NER, chấm điểm, ghi đè Broker
│   │   ├── modals/
│   │   │   ├── OutreachModal.tsx          # Trình tạo Email chào tàu (Tiếng Việt & Tiếng Anh Baltic)
│   │   │   ├── KpiModal.tsx               # Báo cáo hiệu suất, tiết kiệm chi phí, đối chiếu 350 DN
│   │   │   ├── RulesModal.tsx             # Cấu hình trọng số (Tổng 100%), ngưỡng điểm, từ điển từ khóa
│   │   │   ├── UploadModal.tsx            # Nạp Excel/CSV linh hoạt, tải file mẫu, thêm nhanh hồ sơ
│   │   │   └── BenchmarkModal.tsx         # Bảng số liệu thực tế 2024-2025 phòng Chartering
│   │   └── ui/
│   │       └── Toast.tsx                  # Thông báo tương tác góc màn hình
│   └── lib/
│       ├── types/                         # Định nghĩa kiểu dữ liệu TypeScript (Lead, Rules, KPI)
│       ├── data/                          # 12 hồ sơ mẫu chuẩn (SG-2501 đến SG-2512), bộ từ điển, benchmark
│       ├── engine/
│       │   ├── scoring.ts                 # Thuật toán ma trận chấm điểm đa chiều & Negative Gate
│       │   ├── data-masking.ts            # Xử lý ẩn danh dữ liệu cá nhân (Mục 3.5.2)
│       │   ├── excel.ts                   # Đọc/ghi Excel (SheetJS), ánh xạ cột thông minh (Fuzzy matching)
│       │   └── storage.ts                 # Lưu trữ phiên làm việc an toàn tại localStorage
│       └── hooks/
│           └── useLeadsManager.ts         # Custom Hook quản lý State, Action, Filter, Persistence
├── .env.example                           # Mẫu cấu hình khóa API Gemini (tùy chọn)
├── vercel.json                            # Cấu hình triển khai tự động Vercel
└── package.json                           # Khai báo dependencies tiêu chuẩn Next.js 15
```

---

## 3. HƯỚNG DẪN CÀI ĐẶT & CHẠY LOCAL

### Yêu cầu môi trường:
* **Node.js**: Phiên bản 18+ hoặc 20+ hoặc 24+
* **npm**: Phiên bản 9+ hoặc mới hơn

### Các bước khởi chạy:
```bash
# 1. Cài đặt các gói thư viện
npm install

# 2. Khởi chạy server phát triển
npm run dev
```

Mở trình duyệt truy cập: `http://localhost:3000`

---

## 4. HƯỚNG DẪN TRIỂN KHAI LÊN VERCEL (1-CLICK DEPLOY)

Hệ thống được tối ưu hóa 100% cho nền tảng **Vercel**:

### Cách 1: Đẩy mã nguồn lên GitHub và kết nối Vercel (Khuyên dùng)
1. Tạo một repository mới trên GitHub (ví dụ: `SGCL-Chartering-CustomerIQ`).
2. Đẩy toàn bộ thư mục dự án lên:
   ```bash
   git add .
   git commit -m "feat: complete modular chartering lead qualification system"
   git branch -M main
   git remote add origin https://github.com/<your-username>/SGCL-Chartering-CustomerIQ.git
   git push -u origin main
   ```
3. Truy cập [vercel.com](https://vercel.com), bấm **Add New Project** $\rightarrow$ chọn repository vừa tạo.
4. (Tùy chọn) Điền `GEMINI_API_KEY` vào mục **Environment Variables** nếu muốn bật tính năng AI mở rộng.
5. Bấm **Deploy**. Vercel sẽ tự động build và cung cấp đường link Public (ví dụ: `https://customer-iq.vercel.app`) để chia sẻ cho giảng viên hoặc đồng nghiệp dùng ngay!

### Cách 2: Triển khai trực tiếp qua Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 5. TÍNH NĂNG VÀ NGHIỆP VỤ NỔI BẬT

* **Chạy Offline/Client-side tốc độ cao:** Toàn bộ thuật toán chấm điểm, bóc tách số liệu, lọc danh sách và xuất file Excel chạy trực tiếp trên trình duyệt với thời gian phản hồi tức thì ($<0,01$ giây), không phụ thuộc server bên ngoài.
* **Tùy chọn Cloud Serverless Functions:** Khi có `GEMINI_API_KEY`, hệ thống kích hoạt thêm API route `/api/screen-leads` và `/api/generate-outreach` phục vụ các tình huống phân tích văn bản chuyên sâu.
* **Bảo vệ quyền riêng tư:** Dữ liệu nạp từ máy người dùng không bị lưu trữ trái phép trên máy chủ công cộng, toàn bộ lịch sử chỉnh sửa được mã hóa và lưu tại `localStorage` trình duyệt.
* **Nhận diện cột Excel thông minh:** Không bắt buộc file người dùng phải đặt tên cột cố định. Thuật toán Fuzzy Matching tự nhận diện linh hoạt các biến thể: *Tên công ty, Khách hàng, Doanh nghiệp, Mặt hàng, Hàng hóa, Tuyến, Cảng, POL/POD, Sản lượng, Quy mô, Khối lượng...*
