import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "로또 6/45 최근 50회 통계 | 당첨번호 조회 · 번호 생성기",
  description: "로또 6/45 최근 50회차 번호 통계, 역대 당첨번호 조회, 무료 번호 생성기. 1회차부터 최신 회차까지 전체 데이터 분석. 번호별 출현 빈도, 홀짝 비율, 구간별 통계를 한눈에 확인하세요.",
  keywords: "로또, 로또 6/45, 최근 50회 통계, 당첨번호 조회, 번호 생성기, 로또 통계, 동행복권, 로또 번호 분석",
  metadataBase: new URL("https://lotto.ysw.kr"),
  openGraph: {
    title: "로또 6/45 최근 50회 통계 | 당첨번호 조회",
    description: "로또 최근 50회차 번호 통계, 역대 당첨번호 조회, 무료 번호 생성기. 번호별 출현 빈도와 통계를 확인하세요.",
    type: "website",
    url: "https://lotto.ysw.kr",
  },
  alternates: {
    canonical: "https://lotto.ysw.kr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased min-h-screen flex flex-col pattern-dots`}
      >
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
