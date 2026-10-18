import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap"
});

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  title: "SGCL Chartering — Hệ thống Sàng lọc & Phân loại Khách hàng Hàng hải",
  description: "Phân hệ Sàng lọc & Đánh giá Khách hàng Môi giới Tàu biển (Chartering Lead Qualification) - Saigon Cuulong JSC",
  keywords: ["SGCL", "Chartering", "Shipbroking", "Dry Bulk", "Project Cargo", "Sàng lọc khách hàng", "Hàng hải"],
  authors: [{ name: "Saigon Cuulong JSC" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
