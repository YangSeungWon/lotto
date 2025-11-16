export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>
            <strong>면책 조항:</strong> 이 사이트는 교육 및 오락 목적으로만 제공됩니다. 로또 당첨 확률을
            높이는 방법은 존재하지 않습니다.
          </p>
          <p>모든 번호 조합은 동일한 당첨 확률(8,145,060분의 1)을 가집니다.</p>
          <p className="text-xs text-gray-500">
            도박 문제가 있으신가요?{' '}
            <a
              href="https://www.kcgp.or.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              한국도박문제관리센터 1336
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-4">
            © {new Date().getFullYear()} 로또 통계 - 데이터 기반 교육 사이트
          </p>
        </div>
      </div>
    </footer>
  );
}
