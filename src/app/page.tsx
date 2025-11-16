import LottoBall from '@/components/LottoBall';
import Disclaimer from '@/components/Disclaimer';
import { LotteryDraw } from '@/lib/types';
import { formatKRW, calculateOdds } from '@/lib/lottery-utils';
import Link from 'next/link';
import lotteryData from '../../public/data/lottery-history.json';

export default function HomePage() {
  const draws = lotteryData as LotteryDraw[];
  const latestDraw = draws[0];
  const recentDraws = draws.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">로또 6/45 통계 분석</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          교육적이고 정직한 로또 통계 사이트입니다. 모든 통계는 오락 및 교육 목적으로만 제공되며, 당첨 확률을
          높이지 않습니다.
        </p>
      </div>

      <Disclaimer type="warning" />

      {/* Latest Draw */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">최신 당첨번호</h2>
          <span className="text-sm text-gray-500">
            제 {latestDraw.round}회 ({latestDraw.date})
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {latestDraw.numbers.map((num, idx) => (
            <LottoBall key={idx} number={num} size="lg" />
          ))}
          <LottoBall number={latestDraw.bonusNumber} size="lg" isBonus />
        </div>

        <div className="text-center text-gray-600">
          <p>
            1등 당첨금: <span className="font-bold">{formatKRW(latestDraw.firstPrizeAmount)}</span>
          </p>
          <p>
            1등 당첨자: <span className="font-bold">{latestDraw.firstPrizeWinners}명</span>
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{draws.length}</div>
          <div className="text-gray-600">총 추첨 횟수</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{calculateOdds()}</div>
          <div className="text-gray-600">1등 당첨 확률</div>
          <div className="text-xs text-gray-400 mt-1">모든 조합 동일</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">-50%</div>
          <div className="text-gray-600">평균 기대수익률</div>
          <div className="text-xs text-gray-400 mt-1">투자금 대비</div>
        </div>
      </div>

      {/* Recent Draws */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">최근 당첨번호</h2>
          <Link href="/results" className="text-blue-500 hover:underline text-sm">
            전체보기 →
          </Link>
        </div>

        <div className="space-y-4">
          {recentDraws.map((draw) => (
            <div key={draw.round} className="flex items-center justify-between border-b pb-3">
              <div className="text-sm text-gray-500">
                제 {draw.round}회
                <br />
                <span className="text-xs">{draw.date}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {draw.numbers.map((num, idx) => (
                  <LottoBall key={idx} number={num} size="sm" />
                ))}
                <LottoBall number={draw.bonusNumber} size="sm" isBonus />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/generator"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 text-center hover:opacity-90 transition"
        >
          <div className="text-3xl mb-2">🎲</div>
          <div className="font-bold">무작위 번호 생성</div>
          <div className="text-sm opacity-80">진정한 무작위 번호</div>
        </Link>

        <Link
          href="/statistics"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-6 text-center hover:opacity-90 transition"
        >
          <div className="text-3xl mb-2">📊</div>
          <div className="font-bold">통계 분석</div>
          <div className="text-sm opacity-80">과거 데이터 시각화</div>
        </Link>

        <Link
          href="/education"
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-6 text-center hover:opacity-90 transition"
        >
          <div className="text-3xl mb-2">📚</div>
          <div className="font-bold">확률 교육</div>
          <div className="text-sm opacity-80">수학적 진실 이해하기</div>
        </Link>

        <Link
          href="/results"
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg p-6 text-center hover:opacity-90 transition"
        >
          <div className="text-3xl mb-2">🔍</div>
          <div className="font-bold">당첨번호 조회</div>
          <div className="text-sm opacity-80">전체 회차 검색</div>
        </Link>
      </div>

      <Disclaimer type="education" />
    </div>
  );
}
