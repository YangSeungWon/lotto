'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import LottoBall from '@/components/LottoBall';
import Disclaimer from '@/components/Disclaimer';
import {
  generateRandomNumbers,
  TOTAL_COMBINATIONS,
  checkHistoricalPerformance,
} from '@/lib/lottery-utils';
import { LotteryDraw } from '@/lib/types';
import lotteryData from '../../../public/data/lottery-history.json';

const SPEED_LEVELS = {
  1: { interval: 100, label: '느림', emoji: '🐢' },
  2: { interval: 30, label: '보통', emoji: '🐇' },
  3: { interval: 10, label: '빠름', emoji: '🚀' },
};

export default function GeneratorPage() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<number[][]>([]);
  const [autoMode, setAutoMode] = useState<'none' | '1st' | '2nd'>('none');
  const [attemptCount, setAttemptCount] = useState(0);
  const [speedLevel, setSpeedLevel] = useState<1 | 2 | 3>(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoModeRef = useRef<'none' | '1st' | '2nd'>('none');
  const speedLevelRef = useRef<1 | 2 | 3>(1);
  const draws = lotteryData as LotteryDraw[];

  const historicalPerformance = useMemo(() => {
    if (numbers.length === 0) return null;
    return checkHistoricalPerformance(numbers, draws);
  }, [numbers, draws]);

  const handleGenerate = () => {
    const newNumbers = generateRandomNumbers();
    setNumbers(newNumbers);
    setHistory((prev) => [newNumbers, ...prev.slice(0, 9)]);
    if (autoMode !== 'none') {
      setAttemptCount((prev) => prev + 1);
    }
  };

  const stopAutoGenerate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAutoMode('none');
    autoModeRef.current = 'none';
  }, []);

  const startAutoGenerate = useCallback((target: '1st' | '2nd') => {
    setAutoMode(target);
    autoModeRef.current = target;
    setAttemptCount(0);

    // Generate first number immediately
    const newNumbers = generateRandomNumbers();
    setNumbers(newNumbers);
    setHistory((prev) => [newNumbers, ...prev.slice(0, 9)]);
    setAttemptCount(1);

    // Check first result
    const firstPerf = checkHistoricalPerformance(newNumbers, draws);
    if (target === '1st' && firstPerf.firstPlace > 0) {
      return;
    }
    if (target === '2nd' && (firstPerf.firstPlace > 0 || firstPerf.secondPlace > 0)) {
      return;
    }

    // Start interval with current speed
    const currentSpeed = SPEED_LEVELS[speedLevelRef.current].interval;
    intervalRef.current = setInterval(() => {
      const nums = generateRandomNumbers();
      setNumbers(nums);
      setHistory((prev) => [nums, ...prev.slice(0, 9)]);
      setAttemptCount((prev) => prev + 1);

      // Check if target reached
      const perf = checkHistoricalPerformance(nums, draws);
      const currentMode = autoModeRef.current;

      if (currentMode === '1st' && perf.firstPlace > 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setAutoMode('none');
        autoModeRef.current = 'none';
      } else if (currentMode === '2nd' && (perf.firstPlace > 0 || perf.secondPlace > 0)) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setAutoMode('none');
        autoModeRef.current = 'none';
      }
    }, currentSpeed);
  }, [draws]);

  const changeSpeed = useCallback((newLevel: 1 | 2 | 3) => {
    setSpeedLevel(newLevel);
    speedLevelRef.current = newLevel;

    // If auto mode is running, restart with new speed
    if (autoMode !== 'none' && intervalRef.current) {
      clearInterval(intervalRef.current);

      const newInterval = SPEED_LEVELS[newLevel].interval;
      intervalRef.current = setInterval(() => {
        const nums = generateRandomNumbers();
        setNumbers(nums);
        setHistory((prev) => [nums, ...prev.slice(0, 9)]);
        setAttemptCount((prev) => prev + 1);

        const perf = checkHistoricalPerformance(nums, draws);
        const currentMode = autoModeRef.current;

        if (currentMode === '1st' && perf.firstPlace > 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setAutoMode('none');
          autoModeRef.current = 'none';
        } else if (currentMode === '2nd' && (perf.firstPlace > 0 || perf.secondPlace > 0)) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setAutoMode('none');
          autoModeRef.current = 'none';
        }
      }, newInterval);
    }
  }, [autoMode, draws]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10 animate-fade-in">
        <div className="text-5xl mb-4">🎲</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
          무작위 번호 생성기
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          암호학적으로 안전한 무작위 번호를 생성합니다.
          <br />
          <span className="text-purple-600 font-medium">
            이 번호는 다른 어떤 조합과도 동일한 당첨 확률을 가집니다.
          </span>
        </p>
      </div>

      <Disclaimer type="warning" />

      {/* Generator */}
      <div className="card-elevated rounded-2xl p-10 mb-8">
        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={autoMode !== 'none'}
            className="btn-primary text-white font-bold py-5 px-12 rounded-full text-xl shadow-xl mb-6 disabled:opacity-50"
          >
            🎲 번호 생성하기
          </button>

          {/* Speed Control */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className="text-sm text-gray-600 font-medium">속도:</span>
            {([1, 2, 3] as const).map((level) => (
              <button
                key={level}
                onClick={() => changeSpeed(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  speedLevel === level
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {SPEED_LEVELS[level].emoji} {SPEED_LEVELS[level].label}
              </button>
            ))}
          </div>

          {/* Auto Generate Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {autoMode === 'none' ? (
              <>
                <button
                  onClick={() => startAutoGenerate('1st')}
                  className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all"
                >
                  🏆 1등 나올 때까지 반복
                </button>
                <button
                  onClick={() => startAutoGenerate('2nd')}
                  className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all"
                >
                  🥈 2등 나올 때까지 반복
                </button>
              </>
            ) : (
              <button
                onClick={stopAutoGenerate}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all animate-pulse"
              >
                ⏹️ 중지
              </button>
            )}
          </div>

          {/* Attempt Counter */}
          {attemptCount > 0 && (
            <div className="bg-indigo-50 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                {attemptCount.toLocaleString()}회
              </div>
              <div className="text-sm text-indigo-500">
                {autoMode !== 'none' ? '시도 중...' : '총 시도 횟수'}
              </div>
              {autoMode === 'none' && attemptCount > 0 && (
                <div className="text-xs text-gray-500 mt-2">
                  투자금: {(attemptCount * 1000).toLocaleString()}원
                </div>
              )}
            </div>
          )}

          {numbers.length > 0 && (
            <div className="animate-fade-in">
              <div className="flex flex-wrap justify-center gap-4 mb-6 ball-container">
                {numbers.map((num, idx) => (
                  <LottoBall key={idx} number={num} size="lg" animate={autoMode === 'none'} />
                ))}
              </div>
              <p className="text-base text-gray-600">
                이 조합의 당첨 확률:{' '}
                <span className="font-bold text-red-500">1 in {TOTAL_COMBINATIONS.toLocaleString()}</span>
              </p>
              <p className="text-sm text-amber-600 mt-2 font-medium">
                ⚠️ 다른 모든 조합과 동일한 확률입니다
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Historical Performance */}
      {historicalPerformance && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="font-bold text-indigo-900 mb-4 text-center">
            📜 과거 {draws.length}회 추첨에서의 성과
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-white rounded-lg p-3 text-center shadow">
              <div className="text-2xl font-bold text-yellow-600">{historicalPerformance.firstPlace}</div>
              <div className="text-xs text-gray-600">1등</div>
              <div className="text-xs text-gray-400">6개 일치</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow">
              <div className="text-2xl font-bold text-gray-500">{historicalPerformance.secondPlace}</div>
              <div className="text-xs text-gray-600">2등</div>
              <div className="text-xs text-gray-400">5개+보너스</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow">
              <div className="text-2xl font-bold text-orange-600">{historicalPerformance.thirdPlace}</div>
              <div className="text-xs text-gray-600">3등</div>
              <div className="text-xs text-gray-400">5개 일치</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow">
              <div className="text-2xl font-bold text-blue-600">{historicalPerformance.fourthPlace}</div>
              <div className="text-xs text-gray-600">4등</div>
              <div className="text-xs text-gray-400">4개 일치</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow">
              <div className="text-2xl font-bold text-green-600">{historicalPerformance.fifthPlace}</div>
              <div className="text-xs text-gray-600">5등</div>
              <div className="text-xs text-gray-400">3개 일치</div>
            </div>
          </div>

          {/* Best Matches */}
          {historicalPerformance.matchingDraws.length > 0 && (
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">가장 잘 맞았던 회차 (Top {Math.min(10, historicalPerformance.matchingDraws.length)})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {historicalPerformance.matchingDraws.map((match) => (
                  <div key={match.round} className="flex items-center justify-between text-sm border-b pb-2">
                    <div>
                      <span className="font-medium">제 {match.round}회</span>
                      <span className="text-gray-500 text-xs ml-2">({match.date})</span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold ${
                          match.matchCount === 6
                            ? 'text-yellow-600'
                            : match.matchCount === 5
                            ? 'text-orange-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {match.matchCount}개 일치
                      </span>
                      {match.bonusMatch && (
                        <span className="text-purple-600 ml-1 text-xs">(+보너스)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-indigo-600 mt-4 text-center">
            ⚠️ 이는 과거 기록일 뿐입니다. 미래 결과와는 무관합니다.
          </p>
        </div>
      )}

      {/* Important Info */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-blue-800 mb-3">🧠 알아두세요</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>
            <strong>• 모든 조합은 동일한 확률:</strong> 1, 2, 3, 4, 5, 6도 7, 14, 21, 28, 35, 42와 같은 확률입니다.
          </li>
          <li>
            <strong>• &ldquo;핫 넘버&rdquo;는 의미없음:</strong> 과거에 자주 나온 번호가 앞으로 더 잘 나올 이유가
            없습니다.
          </li>
          <li>
            <strong>• 무작위성:</strong> 이 생성기는 crypto.getRandomValues()를 사용하여 진정한 무작위 번호를
            생성합니다.
          </li>
          <li>
            <strong>• 기대값:</strong> 평균적으로 1,000원 투자 시 약 500원을 잃습니다 (기대수익률 -50%).
          </li>
        </ul>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">최근 생성 기록</h3>
          <div className="space-y-3">
            {history.map((nums, idx) => (
              <div key={idx} className="flex items-center justify-between border-b pb-2">
                <span className="text-sm text-gray-500">#{idx + 1}</span>
                <div className="flex gap-2">
                  {nums.map((num, nIdx) => (
                    <LottoBall key={nIdx} number={num} size="sm" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Disclaimer type="education" />
    </div>
  );
}
