'use client';

import { TOTAL_COMBINATIONS } from '@/lib/lottery-utils';

interface DisclaimerProps {
  type?: 'warning' | 'info' | 'education';
}

export default function Disclaimer({ type = 'warning' }: DisclaimerProps) {
  if (type === 'warning') {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <strong>중요 안내:</strong> 모든 번호 조합의 당첨 확률은{' '}
              <strong>동일하게 {TOTAL_COMBINATIONS.toLocaleString()}분의 1</strong>입니다. 과거 통계는 미래
              결과를 예측할 수 없습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'info') {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              이 통계는 <strong>오락 및 교육 목적</strong>으로만 제공됩니다. 로또는 완전한 무작위 추첨이므로
              어떤 분석도 당첨 확률을 높이지 않습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">
            <strong>교육적 관점:</strong> 로또 추첨은 독립적 사건입니다. 과거의 결과는 미래의 결과에 영향을
            주지 않습니다. 이를 &ldquo;도박사의 오류&rdquo;라고 합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
