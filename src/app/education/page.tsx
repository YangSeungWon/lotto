'use client';

import { useState } from 'react';
import Disclaimer from '@/components/Disclaimer';
import { TOTAL_COMBINATIONS, calculateExpectedValue } from '@/lib/lottery-utils';

export default function EducationPage() {
  const [investmentAmount, setInvestmentAmount] = useState(10000);

  const expectedLoss = Math.abs(calculateExpectedValue(1000) * (investmentAmount / 1000));
  const yearsToWin = Math.ceil(TOTAL_COMBINATIONS / 52); // If buying 1 ticket per week

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">확률과 수학의 진실</h1>
        <p className="text-gray-600">
          로또를 통해 배우는 확률 이론. 이 페이지는 수학적 사실에 기반합니다.
        </p>
      </div>

      {/* Key Facts */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">핵심 사실</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{TOTAL_COMBINATIONS.toLocaleString()}</div>
            <div className="text-sm opacity-90">가능한 모든 조합 수</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">100%</div>
            <div className="text-sm opacity-90">모든 조합의 동일한 확률</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">0%</div>
            <div className="text-sm opacity-90">통계 분석으로 확률 향상 가능성</div>
          </div>
        </div>
      </div>

      <Disclaimer type="education" />

      {/* Gambler's Fallacy */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-red-600 mb-4">🎰 도박사의 오류 (Gambler&apos;s Fallacy)</h3>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>정의:</strong> 과거의 결과가 미래의 독립적인 사건에 영향을 미친다는 잘못된 믿음입니다.
          </p>
          <div className="bg-red-50 p-4 rounded">
            <p className="font-medium text-red-800 mb-2">잘못된 생각의 예:</p>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              <li>&ldquo;7번이 5주 동안 안 나왔으니 이번에는 나올 거야&rdquo;</li>
              <li>&ldquo;연속으로 같은 번호가 나올 리 없어&rdquo;</li>
              <li>&ldquo;이 패턴이 자주 나왔으니 따라하면 당첨될 거야&rdquo;</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="font-medium text-green-800 mb-2">수학적 진실:</p>
            <p className="text-green-700">
              로또 공은 &ldquo;기억&rdquo;이 없습니다. 매 추첨은 완전히 독립적인 사건입니다. 지난주에 어떤 번호가
              나왔든, 이번 주 모든 번호의 확률은 정확히 동일합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Expected Value */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-600 mb-4">📊 기대값 (Expected Value)</h3>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>정의:</strong> 장기적으로 예상되는 평균 수익 또는 손실입니다.
          </p>
          <div className="bg-blue-50 p-4 rounded">
            <p className="font-medium text-blue-800 mb-2">로또의 기대값:</p>
            <p className="text-blue-700">
              로또 판매 수익의 약 50%만 당첨금으로 환원됩니다. 즉, 1,000원을 투자하면 평균적으로{' '}
              <strong>500원을 잃습니다</strong> (기대값 = -500원).
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <p className="font-medium text-gray-800 mb-3">기대 손실 계산기:</p>
            <div className="flex items-center gap-4">
              <label className="text-sm">투자 금액:</label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="border rounded px-3 py-1 w-32"
                step={1000}
              />
              <span className="text-sm">원</span>
            </div>
            <div className="mt-3 text-lg">
              예상 손실: <span className="font-bold text-red-600">{expectedLoss.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      {/* Independence */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-green-600 mb-4">🎲 독립 사건 (Independent Events)</h3>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>정의:</strong> 한 사건의 결과가 다른 사건의 확률에 영향을 주지 않는 것입니다.
          </p>
          <div className="bg-green-50 p-4 rounded">
            <p className="font-medium text-green-800 mb-2">동전 던지기 예:</p>
            <p className="text-green-700">
              앞면이 10번 연속 나왔어도, 다음 던지기에서 앞면이 나올 확률은 여전히 정확히 50%입니다. 동전은
              이전 결과를 &ldquo;기억&rdquo;하지 않습니다.
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <p className="font-medium text-yellow-800 mb-2">로또에 적용:</p>
            <p className="text-yellow-700">
              로또 기계도 마찬가지입니다. 모든 추첨은 독립적이며, 과거 결과는 미래 결과에 영향을 주지 않습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Time to Win */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-purple-600 mb-4">⏰ 당첨까지 걸리는 시간</h3>
        <div className="space-y-4 text-gray-700">
          <div className="bg-purple-50 p-4 rounded text-center">
            <p className="text-lg mb-2">매주 1장씩 구매한다면?</p>
            <p className="text-3xl font-bold text-purple-700">{yearsToWin.toLocaleString()}년</p>
            <p className="text-sm text-purple-600 mt-2">
              (통계적으로 1등 당첨을 위해 필요한 기간)
            </p>
          </div>
          <p className="text-sm text-gray-600">
            물론 이것은 평균값이며, 첫 주에 당첨될 수도 있고 영원히 당첨되지 않을 수도 있습니다.
          </p>
        </div>
      </div>

      {/* Why Do People Play? */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-orange-600 mb-4">🤔 그럼에도 사람들이 로또를 하는 이유</h3>
        <div className="space-y-3 text-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-lg">🎭</span>
            <div>
              <strong>오락:</strong> 꿈을 꾸는 즐거움. 적은 비용으로 잠시나마 부자가 된 상상을 할 수 있습니다.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">🤝</span>
            <div>
              <strong>사회적 경험:</strong> 친구나 동료와 함께 구매하고 결과를 확인하는 재미.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">💝</span>
            <div>
              <strong>공익 기여:</strong> 로또 수익금 일부는 사회복지 등 공익사업에 사용됩니다.
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-orange-50 rounded">
          <p className="text-orange-800 font-medium">
            중요: 로또는 투자가 아닌 오락으로 봐야 합니다. 잃어도 괜찮은 금액만 사용하세요.
          </p>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">도움이 필요하신가요?</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            도박으로 인한 문제가 있다면:{' '}
            <a
              href="https://www.kcgp.or.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              한국도박문제관리센터 (1336)
            </a>
          </p>
          <p>
            더 많은 수학 학습:{' '}
            <a
              href="https://ko.khanacademy.org/math/statistics-probability"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              칸아카데미 확률과 통계
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
