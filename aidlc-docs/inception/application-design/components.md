# Components

## 기술 결정사항 요약

| 영역 | 결정 |
|------|------|
| Backend 아키텍처 | 3-Layer (Controller → Service → Repository) |
| Frontend 구조 | Feature 기반 |
| 상태 관리 | Zustand |
| API 통신 | React Query + Axios |
| DB 접근 | Prisma ORM |
| 인증 미들웨어 | 단일 미들웨어 |
| SSE 구현 | better-sse 라이브러리 |
| 에러 처리 | 중앙 집중 (글로벌 에러 핸들러) |
| Monorepo | Turborepo |

---

## Backend Components

### 1. AuthController
- **책임**: 고객 테이블 로그인, 관리자 로그인 요청 처리
- **인터페이스**: REST API 엔드포인트 (`POST /api/tables/login`, `POST /api/admin/login`)

### 2. MenuController
- **책임**: 메뉴 CRUD 요청 처리 (고객 조회 + 관리자 관리)
- **인터페이스**: REST API 엔드포인트 (`GET /api/menus`, `CRUD /api/admin/menus`)

### 3. OrderController
- **책임**: 주문 생성, 조회, 상태 변경, 삭제 요청 처리
- **인터페이스**: REST API 엔드포인트 (`POST /api/orders`, `PATCH /api/admin/orders/:id/status`)

### 4. TableController
- **책임**: 테이블 초기 설정, 이용 완료, 과거 내역 조회
- **인터페이스**: REST API 엔드포인트 (`POST /api/admin/tables/:id/complete`)

### 5. CategoryController
- **책임**: 카테고리 CRUD 요청 처리
- **인터페이스**: REST API 엔드포인트 (`CRUD /api/admin/categories`)

### 6. SSEController
- **책임**: SSE 연결 관리, 실시간 주문 스트림 제공
- **인터페이스**: SSE 엔드포인트 (`GET /api/admin/orders/stream`)

### 7. AuthService
- **책임**: 인증 로직 (JWT 생성/검증, 비밀번호 해싱, 로그인 시도 제한)

### 8. MenuService
- **책임**: 메뉴 비즈니스 로직 (CRUD, 순서 조정, 유효성 검증)

### 9. OrderService
- **책임**: 주문 비즈니스 로직 (생성, 상태 전이, 금액 계산, SSE 이벤트 발행)

### 10. TableService
- **책임**: 테이블/세션 비즈니스 로직 (세션 생성/종료, 이용 완료 처리)

### 11. CategoryService
- **책임**: 카테고리 비즈니스 로직 (CRUD)

### 12. AuthMiddleware
- **책임**: 요청 인증 검증 (JWT 토큰 파싱, 고객/관리자 구분)

### 13. ErrorHandler
- **책임**: 글로벌 에러 처리 (커스텀 에러 클래스 → HTTP 응답 변환)

---

## Frontend Components (Feature 기반)

### 1. features/auth
- **책임**: 테이블 자동 로그인, 관리자 로그인 UI
- **주요 컴포넌트**: LoginForm, AutoLogin

### 2. features/menu
- **책임**: 메뉴 목록/상세 조회, 카테고리 탐색 (고객용)
- **주요 컴포넌트**: MenuList, MenuCard, MenuDetail, CategoryTabs

### 3. features/cart
- **책임**: 장바구니 관리 (추가/삭제/수량 조절)
- **주요 컴포넌트**: CartPanel, CartItem, CartSummary
- **상태**: Zustand store (localStorage 연동)

### 4. features/order
- **책임**: 주문 생성, 주문 내역 조회 (고객용)
- **주요 컴포넌트**: OrderConfirm, OrderHistory, OrderStatus

### 5. features/admin/dashboard
- **책임**: 실시간 주문 모니터링 대시보드
- **주요 컴포넌트**: OrderDashboard, TableCard, OrderDetail
- **실시간**: SSE EventSource 연결

### 6. features/admin/menu-management
- **책임**: 메뉴 등록/수정/삭제/순서 조정 (관리자용)
- **주요 컴포넌트**: MenuForm, MenuList, CategoryManager

### 7. features/admin/table-management
- **책임**: 테이블 설정, 이용 완료, 과거 내역
- **주요 컴포넌트**: TableSetup, TableComplete, OrderHistory

### 8. shared/
- **책임**: 공통 UI 컴포넌트, 유틸리티
- **주요 컴포넌트**: Button, Modal, Loading, ErrorBoundary

---

## Database Layer (Prisma)

### Prisma Models (엔티티)
- **Store**: 매장 정보
- **Table**: 테이블 정보 (Store 소속)
- **TableSession**: 테이블 세션 (시작~이용완료)
- **Admin**: 관리자 계정
- **Category**: 메뉴 카테고리
- **Menu**: 메뉴 항목 (Category 소속)
- **Order**: 주문 (TableSession 소속)
- **OrderItem**: 주문 항목 (Order + Menu 관계)
