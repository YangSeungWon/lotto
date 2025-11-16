'use client';

import { getNumberColor } from '@/lib/lottery-utils';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  isBonus?: boolean;
}

export default function LottoBall({ number, size = 'md', isBonus = false }: LottoBallProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <div className="flex items-center">
      {isBonus && <span className="mr-2 text-gray-500">+</span>}
      <div
        className={`${sizeClasses[size]} ${getNumberColor(number)} rounded-full flex items-center justify-center font-bold shadow-md ${
          isBonus ? 'ring-2 ring-offset-2 ring-gray-400' : ''
        }`}
      >
        {number}
      </div>
    </div>
  );
}
