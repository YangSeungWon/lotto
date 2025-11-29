import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로또 1등 확률 | 도박사의 오류와 기대값 계산',
  description: '로또 6/45 1등 당첨 확률은 8,145,060분의 1. 도박사의 오류, 기대값, 독립 사건의 개념을 알기 쉽게 설명합니다.',
  keywords: '로또 1등 확률, 로또 확률, 도박사의 오류, 기대값, 로또 당첨 확률',
  alternates: {
    canonical: 'https://lotto.ysw.kr/education/',
  },
  openGraph: {
    title: '로또 1등 확률 | 도박사의 오류와 기대값 계산',
    description: '로또 6/45 1등 당첨 확률은 8,145,060분의 1. 도박사의 오류, 기대값, 독립 사건 설명.',
    url: 'https://lotto.ysw.kr/education/',
    type: 'website',
  },
};

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
