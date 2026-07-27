# 🐷 우리아이 디지털 금고 (Kids Cash Vault)

부모님과 아이들이 각자의 스마트폰에서 실시간으로 잔액과 입출금 내역을 확인하는 클라우드 디지털 금고 웹앱입니다.

---

## ✨ 핵심 기능
- 🎈 **부모 / 자녀 역할 분리**: 자녀는 실시간 잔액 및 목표만 조회 (Read-Only), 부모님은 PIN 번호(기본 1234)로 로그인 후 현금 입출금 입력
- 💵 **실시간 지폐/동전 Visualizer**: 5만원권, 1만원권, 5천원권, 1천원권, 동전으로 자동 계산 시각화
- 🎯 **저축 목표 (Wishlist)**: 아이들이 원하는 장난감의 목표 금액 설정 및 달성률(%) 프로그레스 바
- 📱 **모바일 Web PWA 용 완벽 지원**: 스마트폰 브라우저에서 '홈 화면에 추가' 시 모바일 앱처럼 접속
- ⚡ **실시간 클라우드 DB 지원**: Firebase 연동 시 여러 휴대폰 간 0초 실시간 Sync

---

## 🚀 GitHub에 올리고 Vercel에 무료 배포하는 방법 (3분 완료)

### 1단계: GitHub 레포지토리 만들기 & 업로드
1. [GitHub](https://github.com) 로그인 후 **New Repository** 클릭 (`kids-cash-vault` 이름 생성)
2. 로컬 터미널에서 다음 명령어 실행:
   ```bash
   git init
   git add .
   git commit -m "Feat: Kids Cash Vault Initial Release"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_ID/kids-cash-vault.git
   git push -u origin main
   ```

### 2단계: Vercel에서 클릭 몇 번으로 배포하기
1. [Vercel](https://vercel.com) 회원가입 (GitHub 계정으로 1초 로그인)
2. **"Add New Project"** 버튼 클릭 후 방금 만든 `kids-cash-vault` 레포지토리 선택
3. **"Deploy"** 버튼 클릭! 
4. 약 30초 뒤 `https://kids-cash-vault-xxx.vercel.app` 형태의 나만의 전용 웹사이트 링크 완성 🎉

### 3단계: 휴대폰에 앱 아이콘 만들기
- **아이폰 (Safari)**: 하단 공유 버튼 ➔ **'홈 화면에 추가'**
- **안드로이드 (Chrome)**: 우측 상단 점 3개 메뉴 ➔ **'홈 화면에 추가'**
