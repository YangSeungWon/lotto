import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로또 번호 생성기 | 무작위 번호 추천',
  description: '암호학적으로 안전한 로또 6/45 번호 생성기. 모든 조합은 동일한 확률(8,145,060분의 1)을 가집니다.',
  keywords: '로또 번호 생성기, 로또 자동, 무작위 번호, 로또 추천',
};

export default function GeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
