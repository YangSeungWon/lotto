'use client';

import { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Disclaimer from '@/components/Disclaimer';
import { LotteryDraw } from '@/lib/types';
import { calculateStatistics, getNumberColor, TOTAL_NUMBERS } from '@/lib/lottery-utils';
import lotteryData from '../../../public/data/lottery-history.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const RECENT_OPTIONS = [10, 25, 50, 100, 200, 300] as const;

export default function StatisticsPage() {
  const draws = lotteryData as LotteryDraw[];
  const [recentCount, setRecentCount] = useState<number>(50);
  const [customCount, setCustomCount] = useState<string>('');

  const stats = useMemo(() => calculateStatistics(draws), [draws]);

  // Recent N draws statistics
  const recentDraws = useMemo(() => draws.slice(0, recentCount), [draws, recentCount]);
  const recentStats = useMemo(() => calculateStatistics(recentDraws), [recentDraws]);

  // 45개 번호를 번호순으로 정렬 (최근 N회 기준)
  const recentByNumber = useMemo(
    () => [...recentStats.numberFrequency].sort((a, b) => a.number - b.number),
    [recentStats.numberFrequency]
  );

  // 최근 N회 최대/최소 빈도 (색상 강도 계산용)
  const recentMaxFreq = useMemo(() => Math.max(...recentByNumber.map(n => n.frequency)), [recentByNumber]);
  const recentMinFreq = useMemo(() => Math.min(...recentByNumber.map(n => n.frequency)), [recentByNumber]);

  // Sort by number for chart (create new array to avoid mutating)
  const sortedByNumber = useMemo(
    () => [...stats.numberFrequency].sort((a, b) => a.number - b.number),
    [stats.numberFrequency]
  );

  // Top/Bottom by frequency (stats.numberFrequency is already sorted by frequency desc)
  const topNumbers = useMemo(() => stats.numberFrequency.slice(0, 10), [stats.numberFrequency]);
  const bottomNumbers = useMemo(() => stats.numberFrequency.slice(-10).reverse(), [stats.numberFrequency]);

  const frequencyChartData = {
    labels: Array.from({ length: TOTAL_NUMBERS }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        label: '출현 횟수',
        data: sortedByNumber.map((n) => n.frequency),
        backgroundColor: Array.from({ length: TOTAL_NUMBERS }, (_, i) => {
          const num = i + 1;
          if (num <= 10) return '#fbbf24';
          if (num <= 20) return '#3b82f6';
          if (num <= 30) return '#ef4444';
          if (num <= 40) return '#4b5563';
          return '#22c55e';
        }),
      },
    ],
  };

  const oddEvenData = {
    labels: ['홀수', '짝수'],
    datasets: [
      {
        data: [stats.oddEvenRatio.odd, stats.oddEvenRatio.even],
        backgroundColor: ['#8b5cf6', '#06b6d4'],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">로또 6/45 번호 통계</h1>
        <p className="text-gray-600">
          1회차부터 {draws.length}회차까지 전체 당첨번호 분석 · 번호별 출현 빈도 · 홀짝 비율
        </p>
      </div>

      <Disclaimer type="warning" />

      {/* Recent N Draws - 최근 N회 통계 (45개 번호 전체) */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            최근 {recentCount}회 통계
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({recentDraws[recentDraws.length - 1]?.round}회 ~ {recentDraws[0]?.round}회)
            </span>
          </h2>
          <div className="flex flex-wrap gap-2 items-center">
            {RECENT_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => { setRecentCount(count); setCustomCount(''); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  recentCount === count && customCount === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {count}회
              </button>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max={draws.length}
                placeholder="직접 입력"
                value={customCount}
                onChange={(e) => {
                  setCustomCount(e.target.value);
                  const val = parseInt(e.target.value);
                  if (val > 0 && val <= draws.length) {
                    setRecentCount(val);
                  }
                }}
                className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">회</span>
            </div>
          </div>
        </div>

        {/* 45개 번호 그리드 (10열) */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4">
          {recentByNumber.map((num) => {
            // 빈도에 따른 바 너비 계산 (10% ~ 100%)
            const barWidth = recentMaxFreq === recentMinFreq
              ? 50
              : 10 + ((num.frequency - recentMinFreq) / (recentMaxFreq - recentMinFreq)) * 90;

            return (
              <div
                key={num.number}
                className="bg-white rounded-lg p-2 text-center shadow-sm"
              >
                <div
                  className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center font-bold text-sm ${getNumberColor(num.number)}`}
                >
                  {num.number}
                </div>
                <div className="mt-2">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className="text-xs font-bold text-gray-700 mt-1">{num.frequency}회</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-2 h-full bg-blue-400 rounded-full"></div>
            </div>
            <span>적음 ({recentMinFreq}회)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-blue-600 rounded-full"></div>
            <span>많음 ({recentMaxFreq}회)</span>
          </div>
        </div>

        {/* 최근 N회 요약 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-blue-100">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {recentStats.numberFrequency[0]?.number}
            </div>
            <div className="text-xs text-gray-500">가장 많이 ({recentStats.numberFrequency[0]?.frequency}회)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-600">
              {recentStats.numberFrequency[44]?.number}
            </div>
            <div className="text-xs text-gray-500">가장 적게 ({recentStats.numberFrequency[44]?.frequency}회)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {recentStats.sumRange.average.toFixed(0)}
            </div>
            <div className="text-xs text-gray-500">평균 번호합</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-600">
              {((recentStats.oddEvenRatio.odd / (recentStats.oddEvenRatio.odd + recentStats.oddEvenRatio.even)) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">홀수 비율</div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalDraws}</div>
          <div className="text-sm text-gray-600">총 추첨 횟수</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.sumRange.average.toFixed(1)}</div>
          <div className="text-sm text-gray-600">평균 번호 합</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.sumRange.min}</div>
          <div className="text-sm text-gray-600">최소 번호 합</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.sumRange.max}</div>
          <div className="text-sm text-gray-600">최대 번호 합</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Frequency Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">번호별 출현 빈도</h3>
          <div className="h-64">
            <Bar
              data={frequencyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      afterLabel: () => '(과거 데이터 - 미래 예측 불가)',
                    },
                  },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            ⚠️ 빈도가 높다고 앞으로 더 자주 나오는 것이 아닙니다 (독립 사건)
          </p>
        </div>

        {/* Odd/Even */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">홀수/짝수 비율</h3>
          <div className="h-64 flex justify-center">
            <Pie
              data={oddEvenData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            <p>
              홀수: {stats.oddEvenRatio.odd} ({((stats.oddEvenRatio.odd / (stats.oddEvenRatio.odd + stats.oddEvenRatio.even)) * 100).toFixed(1)}%)
            </p>
            <p>
              짝수: {stats.oddEvenRatio.even} ({((stats.oddEvenRatio.even / (stats.oddEvenRatio.odd + stats.oddEvenRatio.even)) * 100).toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Top and Bottom Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">
            가장 많이 나온 번호 <span className="text-xs text-gray-500">(Top 10)</span>
          </h3>
          <div className="space-y-2">
            {topNumbers.map((num, idx) => (
              <div key={num.number} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-6">{idx + 1}.</span>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getNumberColor(
                      num.number
                    )}`}
                  >
                    {num.number}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{num.frequency}회</div>
                  <div className="text-xs text-gray-500">{num.percentage.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-500 mt-4">
            ⚠️ &ldquo;핫 넘버&rdquo;라는 개념은 수학적으로 무의미합니다
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">
            가장 적게 나온 번호 <span className="text-xs text-gray-500">(Bottom 10)</span>
          </h3>
          <div className="space-y-2">
            {bottomNumbers.map((num, idx) => (
              <div key={num.number} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-6">{idx + 1}.</span>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getNumberColor(
                      num.number
                    )}`}
                  >
                    {num.number}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{num.frequency}회</div>
                  <div className="text-xs text-gray-500">{num.percentage.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-500 mt-4">
            ⚠️ 적게 나왔다고 앞으로 &ldquo;나올 차례&rdquo;가 아닙니다
          </p>
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="font-bold text-gray-800 mb-4">오래 안 나온 번호</h3>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {stats.numberFrequency
            .sort((a, b) => b.gapSinceLastAppearance - a.gapSinceLastAppearance)
            .slice(0, 10)
            .map((num) => (
              <div key={num.number} className="text-center">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold ${getNumberColor(
                    num.number
                  )}`}
                >
                  {num.number}
                </div>
                <div className="text-xs mt-1 text-gray-600">{num.gapSinceLastAppearance}회 전</div>
              </div>
            ))}
        </div>
        <p className="text-xs text-red-500 mt-4 text-center">
          ⚠️ 도박사의 오류: 오래 안 나왔다고 나올 확률이 높아지지 않습니다
        </p>
      </div>

      <Disclaimer type="education" />
    </div>
  );
}
