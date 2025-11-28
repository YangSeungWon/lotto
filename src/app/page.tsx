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
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-block mb-4">
          <span className="text-6xl">🍀</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent mb-6">
          로또 6/45 통계 분석
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          1회차부터 최신 회차까지 <span className="text-emerald-600 font-semibold">{draws.length}회</span> 전체 당첨번호 통계
          <br />
          <span className="text-gray-500">
            번호별 출현 빈도, 최근 50회 통계, 무료 번호 생성기
          </span>
        </p>
      </div>

      <Disclaimer type="warning" />

      {/* Latest Draw */}
      <div className="card-elevated rounded-2xl p-8 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">최신 당첨번호</h2>
          <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
            제 {latestDraw.round}회 • {latestDraw.date}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6 ball-container">
          {latestDraw.numbers.map((num, idx) => (
            <LottoBall key={idx} number={num} size="lg" animate />
          ))}
          <LottoBall number={latestDraw.bonusNumber} size="lg" isBonus animate />
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg text-gray-700">
            1등 당첨금:{' '}
            <span className="font-bold text-amber-600 text-2xl">{formatKRW(latestDraw.firstPrizeAmount)}</span>
          </p>
          <p className="text-gray-600">
            1등 당첨자: <span className="font-bold text-emerald-600">{latestDraw.firstPrizeWinners}명</span>
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card-elevated stat-card rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-emerald-600 mb-2">{draws.length.toLocaleString()}</div>
          <div className="text-gray-700 font-medium">총 추첨 횟수</div>
        </div>
        <div className="card-elevated stat-card rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-red-500 mb-2">{calculateOdds()}</div>
          <div className="text-gray-700 font-medium">1등 당첨 확률</div>
          <div className="text-xs text-amber-600 mt-2 font-medium">⚠️ 모든 조합 동일</div>
        </div>
        <div className="card-elevated stat-card rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-red-600 mb-2">-50%</div>
          <div className="text-gray-700 font-medium">평균 기대수익률</div>
          <div className="text-xs text-gray-500 mt-2">투자금 대비 예상 손실</div>
        </div>
      </div>

      {/* Recent Draws */}
      <div className="card-elevated rounded-2xl p-6 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">최근 당첨번호</h2>
          <Link
            href="/results"
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
          >
            전체보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="space-y-4">
          {recentDraws.map((draw) => (
            <div
              key={draw.round}
              className="flex items-center justify-between border-b border-gray-100 pb-4 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">제 {draw.round}회</span>
                <br />
                <span className="text-xs text-gray-500">{draw.date}</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/generator"
          className="link-card bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-8 text-center shadow-lg"
        >
          <div className="text-4xl mb-3">🎲</div>
          <div className="font-bold text-xl mb-2">무작위 번호 생성</div>
          <div className="text-sm opacity-90">진정한 무작위 번호</div>
        </Link>

        <Link
          href="/statistics"
          className="link-card bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-8 text-center shadow-lg"
        >
          <div className="text-4xl mb-3">📊</div>
          <div className="font-bold text-xl mb-2">번호 통계</div>
          <div className="text-sm opacity-90">최근 50회 · 전체 분석</div>
        </Link>

        <Link
          href="/education"
          className="link-card bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl p-8 text-center shadow-lg"
        >
          <div className="text-4xl mb-3">📚</div>
          <div className="font-bold text-xl mb-2">확률 교육</div>
          <div className="text-sm opacity-90">수학적 진실 이해하기</div>
        </Link>

        <Link
          href="/results"
          className="link-card bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-8 text-center shadow-lg"
        >
          <div className="text-4xl mb-3">🔍</div>
          <div className="font-bold text-xl mb-2">당첨번호 조회</div>
          <div className="text-sm opacity-90">전체 회차 검색</div>
        </Link>
      </div>

      <Disclaimer type="education" />
    </div>
  );
}
