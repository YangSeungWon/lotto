import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로또 확률 교육 | 도박사의 오류와 기대값',
  description: '로또를 통해 배우는 확률과 통계. 도박사의 오류, 기대값, 독립 사건의 개념을 이해하세요.',
  keywords: '로또 확률, 도박사의 오류, 기대값, 확률 교육, 통계 학습',
};

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
