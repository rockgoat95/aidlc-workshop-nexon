# 테이블오더 서비스 요구사항 문서

## Intent Analysis

- **User Request**: 테이블오더 서비스 구축 (디지털 주문 시스템)
- **Request Type**: New Project (Greenfield)
- **Scope Estimate**: Multiple Components (고객 UI, 관리자 UI, Backend API, Database)
- **Complexity Estimate**: Moderate (실시간 통신, 인증, 세션 관리 포함)
- **Team Size**: 3명
- **Development Approach**: 풀스택 기능 단위 개발 (병렬 작업)

---

## 1. 기술 스택 결정사항

| 영역 | 기술 |
|------|------|
| Backend | Node.js + Express (TypeScript) |
| Frontend | React (TypeScript) |
| Database | PostgreSQL |
| 실시간 통신 | Server-Sent Events (SSE) |
| 인증 | JWT 토큰 기반 |
| 배포 환경 | AWS |
| 프로젝트 구조 | Monorepo (Frontend + Backend) |
| 이미지 저장 | 로컬 파일 시스템 |

---

## 2. 프로젝트 구조 결정사항

- **Monorepo**: Frontend + Backend 하나의 저장소
- **UI 구성**: 하나의 React 프로젝트에서 라우팅으로 고객용/관리자용 분리
- **매장 범위**: 단일 매장만 지원 (MVP)
- **관리자 계정**: Seed 데이터로 초기 생성 (회원가입 없음)

---

## 3. 기능 요구사항 (Functional Requirements)

### 3.1 고객용 기능 (Customer)

#### FR-C01: 테이블 태블릿 자동 로그인
- 관리자가 1회 초기 설정 (매장 ID, 테이블 번호, 비밀번호)
- 로그인 정보 로컬 저장
- 이후 자동 로그인으로 즉시 주문 가능

#### FR-C02: 메뉴 조회 및 탐색
- 메뉴 화면이 기본 화면
- 카테고리별 메뉴 분류 및 표시
- 메뉴 상세: 메뉴명, 가격, 설명, 이미지
- 카테고리 간 빠른 이동
- 카드 형태 레이아웃, 터치 친화적 (최소 44x44px)

#### FR-C03: 장바구니 관리
- 메뉴 추가/삭제, 수량 조절
- 총 금액 실시간 계산
- 장바구니 비우기
- 클라이언트 측 로컬 저장 (새로고침 시에도 유지)
- 서버 전송은 주문 확정 시에만

#### FR-C04: 주문 생성
- 주문 내역 최종 확인 후 확정
- 주문 성공: 주문 번호 표시 → 장바구니 비우기 → 메뉴 화면 자동 리다이렉트 (5초)
- 주문 실패: 에러 메시지 표시, 장바구니 유지
- 주문 정보: 매장 ID, 테이블 ID, 메뉴 목록(메뉴명, 수량, 단가), 총 금액, 세션 ID

#### FR-C05: 주문 내역 조회
- 현재 테이블 세션 주문만 표시
- 주문 시간 순 정렬
- 주문별: 주문 번호, 시각, 메뉴/수량, 금액, 상태(대기중/준비중/완료)
- 이용 완료 처리된 주문 제외

### 3.2 관리자용 기능 (Admin)

#### FR-A01: 매장 인증
- 매장 ID + 사용자명 + 비밀번호 로그인
- JWT 토큰 기반, 16시간 세션 유지
- 브라우저 새로고침 시 세션 유지
- 비밀번호 bcrypt 해싱
- 로그인 시도 제한

#### FR-A02: 실시간 주문 모니터링
- SSE 기반 실시간 주문 업데이트
- 그리드/대시보드 레이아웃 (테이블별 카드)
- 각 카드: 테이블 번호, 총 주문액, 최신 주문 미리보기
- 카드 클릭 시 전체 메뉴 목록 상세 보기
- 주문 상태 변경 (대기중 → 준비중 → 완료)
- 신규 주문 시각적 강조
- 2초 이내 주문 표시

#### FR-A03: 테이블 관리
- **초기 설정**: 테이블 번호/비밀번호 설정, 16시간 세션 생성
- **주문 삭제**: 확인 팝업 → 즉시 삭제 → 총 주문액 재계산
- **테이블 이용 완료**: 확인 팝업 → 세션 종료 → 주문 내역 과거 이력 이동 → 리셋
- **과거 내역 조회**: 테이블별 과거 주문 목록 (시간 역순), 날짜 필터링

#### FR-A04: 메뉴 관리
- 메뉴 CRUD (등록/조회/수정/삭제)
- 메뉴 정보: 메뉴명, 가격, 설명, 카테고리, 이미지 URL
- 카테고리별 조회
- 메뉴 노출 순서 조정
- 필수 필드 및 가격 범위 검증

---

## 4. 비기능 요구사항 (Non-Functional Requirements)

### NFR-01: 성능
- SSE 기반 실시간 주문 알림 (2초 이내)
- 메뉴 조회 응답 시간 1초 이내

### NFR-02: 사용성
- 터치 친화적 UI (최소 44x44px 버튼)
- 직관적인 카드 형태 레이아웃
- 명확한 시각적 계층 구조

### NFR-03: 데이터 무결성
- 주문 금액 정확성 보장
- 세션 기반 주문 격리 (이전 고객 주문 미노출)

### NFR-04: 가용성
- 브라우저 새로고침 시 세션/장바구니 유지
- 자동 로그인으로 서비스 중단 최소화

---

## 5. 제외 범위 (Out of Scope)

- 결제 처리 (PG사 연동, 영수증, 환불)
- 복잡한 인증 (OAuth, SNS 로그인, 2FA)
- 이미지 리사이징/최적화
- 알림 시스템 (푸시, SMS, 이메일)
- 주방 기능 (주방 전달, 재고 관리)
- 고급 기능 (분석, 매출 리포트, 직원 관리, 예약, 리뷰, 다국어)
- 외부 연동 (배달 플랫폼, POS, 소셜 미디어)

---

## 6. 데이터 모델 개요

### 핵심 엔티티
- **Store**: 매장 정보
- **Table**: 테이블 정보 (매장 소속)
- **TableSession**: 테이블 세션 (시작~이용완료)
- **Category**: 메뉴 카테고리
- **Menu**: 메뉴 항목 (카테고리 소속)
- **Order**: 주문 (테이블 세션 소속)
- **OrderItem**: 주문 항목 (주문 소속)
- **Admin**: 관리자 계정
- **OrderHistory**: 과거 주문 이력

---

## 7. API 개요

### 고객용 API
- `POST /api/tables/login` - 테이블 로그인
- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/:id` - 메뉴 상세 조회
- `POST /api/orders` - 주문 생성
- `GET /api/orders?sessionId=xxx` - 주문 내역 조회

### 관리자용 API
- `POST /api/admin/login` - 관리자 로그인
- `GET /api/admin/orders/stream` - 실시간 주문 스트림 (SSE)
- `GET /api/admin/orders` - 주문 목록 조회
- `PATCH /api/admin/orders/:id/status` - 주문 상태 변경
- `DELETE /api/admin/orders/:id` - 주문 삭제
- `POST /api/admin/tables/:id/complete` - 테이블 이용 완료
- `GET /api/admin/tables/:id/history` - 과거 주문 내역
- `CRUD /api/admin/menus` - 메뉴 관리
- `CRUD /api/admin/categories` - 카테고리 관리
