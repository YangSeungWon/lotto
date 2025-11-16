import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로또 당첨번호 조회 | 전체 회차 검색',
  description: '로또 6/45 역대 당첨번호 조회. 1회부터 최신 회차까지 모든 당첨번호와 당첨금액을 확인하세요.',
  keywords: '로또 당첨번호, 로또 조회, 당첨번호 확인, 로또 결과',
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
