'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/results', label: '당첨결과', icon: '🔍' },
  { href: '/generator', label: '번호생성', icon: '🎲' },
  { href: '/statistics', label: '통계분석', icon: '📊' },
  { href: '/education', label: '확률교육', icon: '📚' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl group-hover:rotate-12 transition-transform">🍀</span>
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
                로또 통계
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className="md:hidden border-t border-emerald-100 bg-white/90">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center px-2 py-1 text-xs transition-colors ${
                pathname === item.href
                  ? 'text-emerald-600 font-bold'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              <span className="text-lg mb-0.5">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
