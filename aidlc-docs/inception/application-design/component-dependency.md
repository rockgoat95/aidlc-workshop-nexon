# Component Dependencies

## Dependency Matrix

### Backend Dependencies

| Component | Depends On |
|-----------|-----------|
| AuthController | AuthService, AuthMiddleware |
| MenuController | MenuService, AuthMiddleware |
| OrderController | OrderService, AuthMiddleware |
| TableController | TableService, AuthMiddleware |
| CategoryController | CategoryService, AuthMiddleware |
| SSEController | better-sse, AuthMiddleware |
| AuthService | Prisma, bcrypt, jsonwebtoken |
| MenuService | Prisma |
| OrderService | Prisma, SSE Channel (better-sse) |
| TableService | Prisma, SSE Channel (better-sse) |
| CategoryService | Prisma |
| AuthMiddleware | AuthService (verifyToken) |
| ErrorHandler | (standalone - Express middleware) |

### Frontend Dependencies

| Component | Depends On |
|-----------|-----------|
| features/auth | useAuthStore, Axios (login API) |
| features/menu | React Query hooks (useMenus), shared UI |
| features/cart | useCartStore, shared UI |
| features/order | React Query hooks (useCreateOrder, useOrders), useCartStore, useAuthStore |
| features/admin/dashboard | React Query hooks, SSE EventSource, shared UI |
| features/admin/menu-management | React Query hooks (admin menus), shared UI |
| features/admin/table-management | React Query hooks (admin tables), shared UI |
| shared/ | (standalone - no feature dependencies) |

---

## Communication Patterns

### Frontend → Backend
```
React Component
  → React Query hook (useQuery / useMutation)
    → Axios instance (baseURL, token interceptor)
      → Express Router
        → AuthMiddleware
          → Controller
            → Service
              → Prisma → PostgreSQL
```

### Backend → Frontend (실시간)
```
Service (OrderService / TableService)
  → SSE Channel broadcast (better-sse)
    → EventSource (브라우저)
      → React Query invalidation
        → UI 자동 업데이트
```

### Client State Flow
```
User Action (메뉴 담기)
  → Zustand store (useCartStore)
    → localStorage (persist)
      → UI 리렌더링
```

---

## Data Flow Diagram

### 고객 주문 흐름
```
[태블릿 UI] → [React Query] → [Axios] → [Express]
     ↑                                        ↓
     |                                   [AuthMiddleware]
     |                                        ↓
     |                                   [OrderController]
     |                                        ↓
     |                                   [OrderService]
     |                                        ↓
     |                                   [Prisma → DB]
     |                                        ↓
     |                                   [SSE broadcast]
     |                                        ↓
     └──────────────────────────────── [관리자 대시보드]
```

### 관리자 실시간 모니터링
```
[관리자 브라우저] ←── SSE EventSource ←── [better-sse Channel]
       ↓                                        ↑
  [React Query]                           [OrderService]
       ↓                                        ↑
    [Axios]  ──→  [Express] ──→ [Controller] ──→ [Service]
```

---

## Package Structure (Turborepo)

```
table-order/                          # Monorepo root
├── turbo.json                        # Turborepo 설정
├── package.json                      # Workspaces 정의
├── packages/
│   ├── frontend/                     # React App
│   │   ├── src/
│   │   │   ├── features/            # Feature 기반 구조
│   │   │   │   ├── auth/
│   │   │   │   ├── menu/
│   │   │   │   ├── cart/
│   │   │   │   ├── order/
│   │   │   │   └── admin/
│   │   │   ├── shared/              # 공통 컴포넌트
│   │   │   ├── stores/              # Zustand stores
│   │   │   ├── hooks/               # React Query hooks
│   │   │   ├── api/                 # Axios 인스턴스
│   │   │   └── App.tsx
│   │   └── package.json
│   └── backend/                      # Express API
│       ├── src/
│       │   ├── controllers/          # 요청/응답 처리
│       │   ├── services/             # 비즈니스 로직
│       │   ├── middlewares/          # auth, error handler
│       │   ├── routes/               # 라우터 정의
│       │   ├── errors/               # 커스텀 에러 클래스
│       │   ├── sse/                  # SSE 관리 (better-sse)
│       │   ├── prisma/               # schema, migrations
│       │   └── app.ts
│       └── package.json
└── prisma/                           # (또는 packages/backend/prisma)
    └── schema.prisma
```
