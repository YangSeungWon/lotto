import { LotteryDraw, NumberStatistics, DrawStatistics } from './types';

export const TOTAL_NUMBERS = 45;
export const NUMBERS_PER_DRAW = 6;
export const TOTAL_COMBINATIONS = 8145060; // C(45, 6)

export function calculateOdds(): string {
  return `1 in ${TOTAL_COMBINATIONS.toLocaleString()}`;
}

export function calculateExpectedValue(ticketPrice: number = 1000): number {
  // Simplified calculation - actual EV is negative
  // Average return is about 50% of ticket sales
  return ticketPrice * 0.5 - ticketPrice;
}

export function getNumberColor(num: number): string {
  if (num <= 10) return 'bg-yellow-400 text-yellow-900';
  if (num <= 20) return 'bg-blue-500 text-white';
  if (num <= 30) return 'bg-red-500 text-white';
  if (num <= 40) return 'bg-gray-600 text-white';
  return 'bg-green-500 text-white';
}

export function generateRandomNumbers(): number[] {
  const numbers: Set<number> = new Set();

  while (numbers.size < NUMBERS_PER_DRAW) {
    // Use crypto for true randomness
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const num = (array[0] % TOTAL_NUMBERS) + 1;
    numbers.add(num);
  }

  return Array.from(numbers).sort((a, b) => a - b);
}

export interface HistoricalMatchResult {
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  fourthPlace: number;
  fifthPlace: number;
  noMatch: number;
  matchingDraws: Array<{
    round: number;
    date: string;
    matchCount: number;
    matchedNumbers: number[];
    bonusMatch: boolean;
  }>;
}

export function checkHistoricalPerformance(
  selectedNumbers: number[],
  historicalDraws: LotteryDraw[]
): HistoricalMatchResult {
  const result: HistoricalMatchResult = {
    firstPlace: 0,
    secondPlace: 0,
    thirdPlace: 0,
    fourthPlace: 0,
    fifthPlace: 0,
    noMatch: 0,
    matchingDraws: [],
  };

  historicalDraws.forEach((draw) => {
    const matchedNumbers = selectedNumbers.filter((num) => draw.numbers.includes(num));
    const matchCount = matchedNumbers.length;
    const bonusMatch = selectedNumbers.includes(draw.bonusNumber);

    // Determine prize tier
    // 1등: 6개 일치
    // 2등: 5개 + 보너스
    // 3등: 5개 일치
    // 4등: 4개 일치
    // 5등: 3개 일치

    if (matchCount === 6) {
      result.firstPlace++;
      result.matchingDraws.push({
        round: draw.round,
        date: draw.date,
        matchCount: 6,
        matchedNumbers,
        bonusMatch: false,
      });
    } else if (matchCount === 5 && bonusMatch) {
      result.secondPlace++;
      result.matchingDraws.push({
        round: draw.round,
        date: draw.date,
        matchCount: 5,
        matchedNumbers,
        bonusMatch: true,
      });
    } else if (matchCount === 5) {
      result.thirdPlace++;
      result.matchingDraws.push({
        round: draw.round,
        date: draw.date,
        matchCount: 5,
        matchedNumbers,
        bonusMatch: false,
      });
    } else if (matchCount === 4) {
      result.fourthPlace++;
      result.matchingDraws.push({
        round: draw.round,
        date: draw.date,
        matchCount: 4,
        matchedNumbers,
        bonusMatch,
      });
    } else if (matchCount === 3) {
      result.fifthPlace++;
    } else {
      result.noMatch++;
    }
  });

  // Sort matching draws by match count (best first), then by round (recent first)
  result.matchingDraws.sort((a, b) => {
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
    if (b.bonusMatch !== a.bonusMatch) return b.bonusMatch ? 1 : -1;
    return b.round - a.round;
  });

  // Limit to top 10 matches
  result.matchingDraws = result.matchingDraws.slice(0, 10);

  return result;
}

export function calculateStatistics(draws: LotteryDraw[]): DrawStatistics {
  const frequency: Map<number, { count: number; lastRound: number }> = new Map();

  // Initialize all numbers
  for (let i = 1; i <= TOTAL_NUMBERS; i++) {
    frequency.set(i, { count: 0, lastRound: 0 });
  }

  let totalOdd = 0;
  let totalEven = 0;
  let totalSum = 0;
  let minSum = Infinity;
  let maxSum = -Infinity;

  const latestRound = draws.length > 0 ? draws[0].round : 0;

  draws.forEach((draw) => {
    const sum = draw.numbers.reduce((a, b) => a + b, 0);
    totalSum += sum;
    minSum = Math.min(minSum, sum);
    maxSum = Math.max(maxSum, sum);

    draw.numbers.forEach((num) => {
      const current = frequency.get(num)!;
      current.count++;
      if (draw.round > current.lastRound) {
        current.lastRound = draw.round;
      }

      if (num % 2 === 0) totalEven++;
      else totalOdd++;
    });
  });

  const numberStats: NumberStatistics[] = [];
  for (let i = 1; i <= TOTAL_NUMBERS; i++) {
    const data = frequency.get(i)!;
    numberStats.push({
      number: i,
      frequency: data.count,
      percentage: draws.length > 0 ? (data.count / (draws.length * NUMBERS_PER_DRAW)) * 100 : 0,
      lastAppearance: data.lastRound,
      gapSinceLastAppearance: latestRound - data.lastRound,
    });
  }

  return {
    totalDraws: draws.length,
    oddEvenRatio: {
      odd: totalOdd,
      even: totalEven,
    },
    sumRange: {
      min: minSum === Infinity ? 0 : minSum,
      max: maxSum === -Infinity ? 0 : maxSum,
      average: draws.length > 0 ? totalSum / draws.length : 0,
    },
    numberFrequency: numberStats.sort((a, b) => b.frequency - a.frequency),
  };
}

export function formatKRW(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}
