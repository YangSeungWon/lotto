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
  title: "로또 6/45 통계 분석 | 당첨번호 조회 및 확률 교육",
  description: "로또 당첨번호 조회, 통계 분석, 확률 교육. 모든 번호 조합은 동일한 확률(8,145,060분의 1)을 가집니다. 교육 및 오락 목적으로만 제공됩니다.",
  keywords: "로또, 당첨번호, 통계, 확률, 번호생성기, 로또6/45, 동행복권",
  metadataBase: new URL("https://lotto.ysw.kr"),
  openGraph: {
    title: "로또 6/45 통계 분석",
    description: "교육적이고 정직한 로또 통계 사이트",
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
