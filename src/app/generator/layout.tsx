import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로또 번호 생성기 | 무료 자동 번호 추천',
  description: '로또 6/45 무료 번호 생성기. 무작위 번호 자동 생성, 과거 당첨번호와 비교 기능. 지금 바로 번호를 뽑아보세요.',
  keywords: '로또 번호 생성기, 로또 자동, 무작위 번호, 로또 추천, 로또 번호 추천',
  alternates: {
    canonical: 'https://lotto.ysw.kr/generator/',
  },
  openGraph: {
    title: '로또 번호 생성기 | 무료 자동 번호 추천',
    description: '로또 6/45 무료 번호 생성기. 무작위 번호 자동 생성, 과거 당첨번호와 비교 기능.',
    url: 'https://lotto.ysw.kr/generator/',
    type: 'website',
  },
};

export default function GeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
