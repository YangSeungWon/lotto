'use client';

import { useState, useMemo } from 'react';
import LottoBall from '@/components/LottoBall';
import { LotteryDraw } from '@/lib/types';
import { formatKRW } from '@/lib/lottery-utils';
import lotteryData from '../../../public/data/lottery-history.json';

export default function ResultsPage() {
  const draws = lotteryData as LotteryDraw[];
  const [searchRound, setSearchRound] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredDraws = useMemo(() => {
    if (searchRound) {
      const roundNum = parseInt(searchRound);
      if (!isNaN(roundNum)) {
        return draws.filter((d) => d.round === roundNum);
      }
    }
    return draws;
  }, [draws, searchRound]);

  const totalPages = Math.ceil(filteredDraws.length / itemsPerPage);
  const paginatedDraws = filteredDraws.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">당첨번호 조회</h1>
        <p className="text-gray-600">제 1회부터 최신 회차까지 모든 당첨번호를 확인하세요.</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 items-center">
          <label className="font-medium text-gray-700">회차 검색:</label>
          <input
            type="number"
            placeholder="회차 번호 입력"
            value={searchRound}
            onChange={(e) => {
              setSearchRound(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2 w-40"
            min={1}
            max={draws[0].round}
          />
          {searchRound && (
            <button onClick={() => setSearchRound('')} className="text-blue-500 hover:underline text-sm">
              전체보기
            </button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">회차</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">추첨일</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">당첨번호</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">1등 당첨금</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">당첨자</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedDraws.map((draw) => (
                <tr key={draw.round} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{draw.round}회</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{draw.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-center gap-1">
                      {draw.numbers.map((num, idx) => (
                        <LottoBall key={idx} number={num} size="sm" />
                      ))}
                      <LottoBall number={draw.bonusNumber} size="sm" isBonus />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {formatKRW(draw.firstPrizeAmount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{draw.firstPrizeWinners}명</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && !searchRound && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            이전
          </button>
          <span className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600">
        <p>
          총 <strong>{draws.length}회</strong> 추첨 데이터 | 첫 추첨: {draws[draws.length - 1].date} | 최신 추첨:{' '}
          {draws[0].date}
        </p>
      </div>
    </div>
  );
}
