# 맛동산 (Matdongsan)
부모가 어린 자녀를 위한 AI 맞춤형 동화를 생성하고 자유롭게 공유할 수 있는 컨텐츠 플랫폼입니다.

📅 개발 기간: 2024.09 ~ 2024.12

---

## 프로젝트 소개

동화를 활용한 교육에서 다양성 부족과 경제적 부담 문제를 해결하기 위해 기획한 서비스입니다.

- 자녀의 한/영 언어 수준에 맞는 AI 동화를 직접 생성하고 다른 사용자와 공유
- 감정 표현이 자연스러운 TTS로 동화 음성 지원
- 원하는 경우 자녀가 하드웨어 디바이스와 직접 상호작용 가능

---

## 팀 구성

| 역할 | 인원 |
|------|------|
| 프론트엔드 | 1명 |
| 백엔드 | 1명 |
| 클라우드 | 1명 |
| 하드웨어 | 1명 |
| AI | 2명 |

---

## 주요 기능

### 로그인
카카오 계정으로 로그인할 수 있습니다.

### AI 동화 생성
자녀의 한/영 언어 수준을 설정하면 수준에 맞는 동화를 AI가 자동으로 생성합니다. 텍스트 생성이 완료되면 내용을 먼저 확인할 수 있고, 음성 생성이 완료되면 TTS 재생이 활성화됩니다.

### 동화 목록
- 인기순 / 최신순 정렬
- 제목 키워드 검색
- 무한 스크롤로 계속 탐색 가능

### 동화 재생
- 재생 / 일시정지 / 10초 전후 이동
- 현재 재생 중인 문장 하이라이트
- 원하는 문장을 선택해 해당 위치부터 재생

### 내 라이브러리
- 좋아요한 동화
- 최근 본 동화
- 내가 만든 동화

---

## 파일 구조

```
matdongsan-client/
├── index.js
├── src/
│   ├── App.tsx
│   ├── api/
│   │   ├── apiManager.ts
│   │   └── serverTokenManager.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── components/
│   │   ├── StorySummary.tsx
│   │   ├── StoryDetail.tsx
│   │   └── FollowSummary.tsx
│   └── screens/
│       ├── SplashScreen.tsx
│       ├── StartScreen.tsx
│       ├── PlayScreen.tsx
│       ├── create/
│       │   ├── HomeScreen.tsx
│       │   ├── LoadingScreen.tsx
│       │   └── StoryCreateFinishScreen.tsx
│       ├── recommend/
│       │   ├── RecommendScreen.tsx
│       │   ├── AllStoryScreen.tsx
│       │   ├── PopularStoryScreen.tsx
│       │   ├── LatestStoryScreen.tsx
│       │   └── allstory/
│       ├── mylibrary/
│       │   ├── MyLibraryScreen.tsx
│       │   ├── LikeStory.tsx
│       │   ├── RecentlySeenStory.tsx
│       │   └── MyCreateStory.tsx
│       └── mystatus/
│           ├── MyStatusScreen.tsx
│           ├── MyPageScreen.tsx
│           ├── ChildrenStatus.tsx
│           ├── FollowList.tsx
│           ├── FollowStoryList.tsx
│           └── QnADashboard.tsx
└── android/ ios/
```

---

## 실행

### 의존성 설치

```bash
npm install
```

iOS는 추가로 CocoaPods 설치가 필요합니다.

```bash
cd ios && bundle exec pod install
```

### 실행

```bash
# Metro 번들러 시작
npm start

# Android
npm run android

# iOS
npm run ios
```
