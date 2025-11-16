'use client';

import { getNumberColor } from '@/lib/lottery-utils';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  isBonus?: boolean;
  animate?: boolean;
}

export default function LottoBall({ number, size = 'md', isBonus = false, animate = false }: LottoBallProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  const shadowClasses = {
    sm: 'shadow-md',
    md: 'shadow-lg',
    lg: 'shadow-xl',
  };

  return (
    <div className="flex items-center">
      {isBonus && <span className="mr-2 text-emerald-600 font-bold text-lg">+</span>}
      <div
        className={`
          ${sizeClasses[size]}
          ${getNumberColor(number)}
          rounded-full
          flex items-center justify-center
          font-bold
          ${shadowClasses[size]}
          ${isBonus ? 'ring-2 ring-offset-2 ring-emerald-400' : ''}
          ${animate ? 'animate-stagger opacity-0' : ''}
          transition-all duration-300
          hover:scale-110 hover:rotate-12
          relative
          overflow-hidden
        `}
        style={{
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%), ${
            number <= 10
              ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
              : number <= 20
              ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
              : number <= 30
              ? 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'
              : number <= 40
              ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
              : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
          }`,
        }}
      >
        <span className="relative z-10 drop-shadow-sm">{number}</span>
      </div>
    </div>
  );
}
