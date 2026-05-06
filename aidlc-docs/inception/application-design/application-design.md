# Application Design - 통합 문서

## 1. 기술 결정사항

| 영역 | 결정 | 근거 |
|------|------|------|
| Backend 아키텍처 | 3-Layer (Controller → Service → Repository) | MVP에 적합한 간결한 구조 |
| Frontend 구조 | Feature 기반 | 기능별 코드 응집도 높음 |
| 상태 관리 | Zustand (클라이언트) + React Query (서버) | 역할 분리 명확, 경량 |
| API 통신 | React Query + Axios | 캐싱/재시도 자동화 |
| DB 접근 | Prisma ORM | TypeScript 타입 안전, 마이그레이션 자동화 |
| 인증 미들웨어 | 단일 미들웨어 | 토큰 파싱 후 역할 구분 |
| SSE 구현 | better-sse 라이브러리 | 연결 관리, heartbeat 내장 |
| 에러 처리 | 중앙 집중 (글로벌 에러 핸들러) | 일관된 에러 응답 형식 |
| Monorepo | Turborepo + npm workspaces | 빌드 캐싱, 병렬 실행 |

---

## 2. 시스템 아키텍처 개요

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  Auth    │ │  Menu    │ │  Cart    │ │  Order    │  │
│  │ Feature  │ │ Feature  │ │ Feature  │ │ Feature   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Admin Features (Dashboard, Menu Mgmt, Table)    │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │
│  │  Zustand   │ │React Query │ │  Axios + SSE       │  │
│  │  (Cart,    │ │(Server     │ │  (API + Realtime)  │  │
│  │   Auth)    │ │ State)     │ │                    │  │
│  └────────────┘ └────────────┘ └────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │ HTTP + SSE
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (Express)                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │              AuthMiddleware (JWT)                  │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Auth    │ │  Menu    │ │  Order   │ │  Table   │  │
│  │Controller│ │Controller│ │Controller│ │Controller│  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       ▼             ▼             ▼             ▼        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Auth    │ │  Menu    │ │  Order   │ │  Table   │  │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │             │             │             │        │
│       ▼             ▼             ▼             ▼        │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Prisma ORM (Repository)              │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │  better-sse      │  │  ErrorHandler (Global)     │  │
│  │  (SSE Channel)   │  │                            │  │
│  └──────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                     │
│  Store, Table, TableSession, Admin, Category,            │
│  Menu, Order, OrderItem                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 3. 핵심 흐름 요약

### 고객 주문 흐름
1. 태블릿 자동 로그인 → JWT 발급
2. 메뉴 조회 (React Query 캐싱)
3. 장바구니 담기 (Zustand + localStorage)
4. 주문 확정 → API 호출 → DB 저장 → SSE broadcast

### 관리자 모니터링 흐름
1. 관리자 로그인 → JWT 발급
2. SSE 연결 (EventSource)
3. 신규 주문 실시간 수신 → React Query invalidation → UI 업데이트
4. 주문 상태 변경 → API 호출 → DB 업데이트 → SSE broadcast

---

## 4. 상세 문서 참조

- [components.md](./components.md) - 컴포넌트 정의 및 책임
- [component-methods.md](./component-methods.md) - 메서드 시그니처
- [services.md](./services.md) - 서비스 오케스트레이션 패턴
- [component-dependency.md](./component-dependency.md) - 의존성 및 데이터 흐름
