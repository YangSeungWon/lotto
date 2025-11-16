# 로또 6/45 통계 분석 사이트

교육적이고 정직한 한국 로또 통계 사이트입니다.

**Live Site: https://lotto.ysw.kr**

## 주요 기능

- **당첨번호 조회**: 1회부터 최신 회차까지 모든 당첨번호 검색
- **번호 생성기**: 암호학적으로 안전한 무작위 번호 생성 (과거 성과 확인 기능 포함)
- **통계 분석**: 번호별 출현 빈도, 홀짝 비율, 번호합 분석
- **확률 교육**: 도박사의 오류, 기대값, 독립 사건 개념 설명

## 핵심 원칙

**모든 번호 조합은 동일한 확률(8,145,060분의 1)을 가집니다.**

이 사이트는:
- 당첨 확률을 높인다고 주장하지 않습니다
- 모든 통계 페이지에 명확한 면책 조항을 포함합니다
- "핫 넘버" 또는 "예측"이라는 용어를 사용하지 않습니다
- 책임감 있는 도박 리소스를 제공합니다

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js, react-chartjs-2
- **Deployment**: Static Export (GitHub Pages)
- **CI/CD**: GitHub Actions

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 로또 데이터 업데이트
node scripts/fetch-lottery-data.js
```

## 프로젝트 구조

```
/src
  /app                 # Next.js App Router
    /generator         # 번호 생성기
    /statistics        # 통계 분석
    /education         # 확률 교육
    /results           # 당첨번호 조회
  /components          # React 컴포넌트
  /lib                 # 유틸리티 함수
/public
  /data               # 로또 역대 데이터 (JSON)
/scripts              # 데이터 수집 스크립트
/.github/workflows    # CI/CD 설정
```

## 자동 데이터 업데이트

GitHub Actions가 매주 일요일 자동으로:
1. 동행복권에서 최신 당첨번호를 가져옵니다
2. 데이터 파일을 업데이트합니다
3. 사이트를 다시 빌드하고 배포합니다

## 배포

### GitHub Pages

1. Repository Settings → Pages → Source를 "GitHub Actions"로 설정
2. main 브랜치에 push하면 자동 배포됩니다
3. 커스텀 도메인 설정: `lotto.ysw.kr`

### 수동 배포

```bash
npm run build
# /out 디렉토리의 파일을 웹 서버에 업로드
```

## 라이선스

MIT License

## 면책 조항

이 사이트는 **교육 및 오락 목적**으로만 제공됩니다. 로또 당첨 확률을 높이는 방법은 존재하지 않습니다. 도박 문제가 있으신 분은 한국도박문제관리센터(1336)에 연락하세요.
