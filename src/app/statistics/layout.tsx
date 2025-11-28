import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로또 6/45 최근 50회 통계 | 번호별 출현 빈도 분석',
  description: '로또 6/45 최근 50회차 번호 통계와 전체 회차 분석. 번호별 출현 빈도, 홀짝 비율, 가장 많이 나온 번호를 확인하세요.',
  keywords: '로또 최근 50회 통계, 로또 번호 분석, 출현 빈도, 홀짝 통계, 로또6/45 통계',
  alternates: {
    canonical: 'https://lotto.ysw.kr/statistics',
  },
};

export default function StatisticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
