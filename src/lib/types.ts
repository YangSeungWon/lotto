export interface LotteryDraw {
  round: number;
  date: string;
  numbers: number[];
  bonusNumber: number;
  firstPrizeAmount: number;
  firstPrizeWinners: number;
}

export interface NumberStatistics {
  number: number;
  frequency: number;
  percentage: number;
  lastAppearance: number;
  gapSinceLastAppearance: number;
}

export interface DrawStatistics {
  totalDraws: number;
  oddEvenRatio: { odd: number; even: number };
  sumRange: { min: number; max: number; average: number };
  numberFrequency: NumberStatistics[];
}
