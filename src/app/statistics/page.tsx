'use client';

import { useMemo } from 'react';
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

export default function StatisticsPage() {
  const draws = lotteryData as LotteryDraw[];

  const stats = useMemo(() => calculateStatistics(draws), [draws]);

  const frequencyChartData = {
    labels: Array.from({ length: TOTAL_NUMBERS }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        label: '출현 횟수',
        data: stats.numberFrequency.sort((a, b) => a.number - b.number).map((n) => n.frequency),
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

  const topNumbers = stats.numberFrequency.slice(0, 10);
  const bottomNumbers = stats.numberFrequency.slice(-10).reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">통계 분석</h1>
        <p className="text-gray-600">
          {draws.length}회의 추첨 데이터를 기반으로 한 통계입니다. 이는 과거 기록일 뿐, 미래를 예측하지
          않습니다.
        </p>
      </div>

      <Disclaimer type="warning" />

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
