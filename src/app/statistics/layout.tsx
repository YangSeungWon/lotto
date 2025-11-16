import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로또 통계 분석 | 번호별 출현 빈도',
  description: '로또 6/45 역대 당첨번호 통계 분석. 번호별 출현 빈도, 홀짝 비율, 번호합 분석. 오락 및 교육 목적으로만 제공됩니다.',
  keywords: '로또 통계, 번호 분석, 출현 빈도, 홀짝 통계, 로또 패턴',
};

export default function StatisticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
