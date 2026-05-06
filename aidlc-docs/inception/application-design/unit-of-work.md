# Unit of Work

## 분해 전략
- **분해 기준**: 풀스택 기능 슬라이스 (DB + API + UI 포함)
- **단위 크기**: 중간 (6개 단위)
- **병렬 작업**: 독립 병렬 (3명이 각자 다른 단위 동시 개발)
- **개발 순서**: Backend 먼저 → Frontend 연결
- **기반 설정**: 풀 기반 (공통 인프라 먼저 완성)

---

## Unit 정의

### Unit 0: 프로젝트 기반 설정 (Foundation)
**범위**: 모든 단위가 공통으로 사용하는 인프라
**담당**: 전원 (또는 1명이 대표로)
**순서**: 가장 먼저 완성

**포함 내용**:
- Turborepo + npm workspaces Monorepo 설정
- Prisma 스키마 전체 (모든 엔티티)
- DB 마이그레이션
- Express 앱 기본 설정 (app.ts, server.ts)
- AuthMiddleware (JWT 검증, 역할 구분)
- 글로벌 에러 핸들러 + 커스텀 에러 클래스
- better-sse Channel 설정
- React 앱 기본 설정 (App.tsx, Router, Layout)
- Axios 인스턴스 + React Query Provider
- Zustand store 기본 구조 (useAuthStore)
- 공통 UI 컴포넌트 (Button, Modal, Loading, ErrorBoundary)
- Seed 데이터 (관리자 계정, 매장 정보)

---

### Unit 1: 인증 (Authentication)
**범위**: 고객 테이블 로그인 + 관리자 로그인 (풀스택)
**담당**: 개발자 1명

**Backend**:
- AuthController (loginTable, loginAdmin)
- AuthService (JWT 생성, bcrypt 비교, 로그인 시도 제한)
- 라우터 설정 (/api/tables/login, /api/admin/login)

**Frontend**:
- features/auth/AutoLogin (테이블 자동 로그인)
- features/auth/AdminLogin (관리자 로그인 폼)
- useAuthStore (토큰 저장, 역할 관리)
- 라우팅 가드 (인증 필요 페이지 보호)

---

### Unit 2: 메뉴 조회 + 관리 (Menu)
**범위**: 고객 메뉴 탐색 + 관리자 메뉴 CRUD (풀스택)
**담당**: 개발자 1명

**Backend**:
- MenuController (list, detail, create, update, delete, updateOrder)
- MenuService (CRUD, 유효성 검증, 순서 조정)
- CategoryController + CategoryService (CRUD)
- 라우터 설정 (/api/menus, /api/admin/menus, /api/admin/categories)

**Frontend**:
- features/menu/MenuList (카테고리별 메뉴 카드 목록)
- features/menu/MenuCard (개별 메뉴 카드)
- features/menu/MenuDetail (메뉴 상세 팝업)
- features/menu/CategoryTabs (카테고리 탭 네비게이션)
- features/admin/menu-management/MenuForm (등록/수정 폼)
- features/admin/menu-management/MenuList (관리자 메뉴 목록)
- features/admin/menu-management/CategoryManager (카테고리 관리)
- React Query hooks (useMenus, useMenuDetail, useCreateMenu, useUpdateMenu, useDeleteMenu)

---

### Unit 3: 장바구니 + 주문 (Cart & Order)
**범위**: 장바구니 관리 + 주문 생성/조회 (풀스택)
**담당**: 개발자 1명

**Backend**:
- OrderController (create, getBySession)
- OrderService (주문 생성, 금액 계산, 세션별 조회)
- 라우터 설정 (/api/orders)

**Frontend**:
- features/cart/CartPanel (장바구니 패널)
- features/cart/CartItem (개별 항목)
- features/cart/CartSummary (총 금액, 주문 버튼)
- features/order/OrderConfirm (주문 확인 화면)
- features/order/OrderHistory (주문 내역 목록)
- features/order/OrderStatus (주문 상태 표시)
- useCartStore (Zustand + localStorage)
- React Query hooks (useCreateOrder, useOrders)

---

### Unit 4: 주문 모니터링 + 상태 관리 (Order Monitoring)
**범위**: 관리자 실시간 대시보드 + 주문 상태 변경/삭제 (풀스택)
**담당**: 개발자 1명

**Backend**:
- SSEController (주문 스트림 엔드포인트)
- OrderController - admin 부분 (list, updateStatus, delete)
- OrderService - admin 부분 (상태 전이 검증, 삭제, SSE broadcast)
- 라우터 설정 (/api/admin/orders, /api/admin/orders/stream)

**Frontend**:
- features/admin/dashboard/OrderDashboard (테이블별 카드 그리드)
- features/admin/dashboard/TableCard (테이블 카드 - 번호, 총액, 미리보기)
- features/admin/dashboard/OrderDetail (주문 상세 모달)
- features/admin/dashboard/OrderStatusButton (상태 변경 버튼)
- SSE EventSource 연결 + React Query invalidation
- React Query hooks (useAdminOrders, useUpdateOrderStatus, useDeleteOrder)

---

### Unit 5: 테이블 관리 (Table Management)
**범위**: 테이블 초기 설정 + 이용 완료 + 과거 내역 (풀스택)
**담당**: 개발자 1명

**Backend**:
- TableController (setup, complete, history)
- TableService (세션 생성/종료, 이력 이동, 과거 내역 조회)
- 라우터 설정 (/api/admin/tables)

**Frontend**:
- features/admin/table-management/TableSetup (테이블 설정 폼)
- features/admin/table-management/TableComplete (이용 완료 확인)
- features/admin/table-management/OrderHistory (과거 주문 내역, 날짜 필터)
- React Query hooks (useSetupTable, useCompleteTable, useTableHistory)

---

## 개발 순서 요약

```
Phase 0: [전원] Unit 0 - 기반 설정
    ↓
Phase 1: [병렬 3명]
    개발자A: Unit 1 (인증)
    개발자B: Unit 2 (메뉴)
    개발자C: Unit 3 (장바구니+주문)
    ↓
Phase 2: [병렬 2명]
    개발자A: Unit 4 (주문 모니터링)
    개발자B: Unit 5 (테이블 관리)
    개발자C: 통합 테스트 + 버그 수정
    ↓
Phase 3: [전원] 통합 + 최종 테스트
```

---

## Code Organization (Greenfield)

```
table-order/
├── turbo.json
├── package.json
├── packages/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── auth/          # Unit 1
│   │   │   │   ├── menu/          # Unit 2
│   │   │   │   ├── cart/          # Unit 3
│   │   │   │   ├── order/         # Unit 3
│   │   │   │   └── admin/
│   │   │   │       ├── dashboard/       # Unit 4
│   │   │   │       ├── menu-management/ # Unit 2
│   │   │   │       └── table-management/# Unit 5
│   │   │   ├── shared/            # Unit 0
│   │   │   ├── stores/            # Unit 0 + 각 Unit
│   │   │   ├── hooks/             # 각 Unit
│   │   │   ├── api/               # Unit 0
│   │   │   └── App.tsx            # Unit 0
│   │   └── package.json
│   └── backend/
│       ├── src/
│       │   ├── controllers/       # 각 Unit
│       │   ├── services/          # 각 Unit
│       │   ├── middlewares/       # Unit 0
│       │   ├── routes/            # 각 Unit
│       │   ├── errors/            # Unit 0
│       │   ├── sse/               # Unit 0 + Unit 4
│       │   └── app.ts             # Unit 0
│       ├── prisma/
│       │   └── schema.prisma      # Unit 0
│       └── package.json
└── prisma/
    └── seed.ts                    # Unit 0
```
