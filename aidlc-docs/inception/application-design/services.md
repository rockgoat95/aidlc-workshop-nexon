# Services

## Service Layer Overview

3-Layer 아키텍처에서 Service 레이어는 비즈니스 로직을 담당합니다.
Controller는 요청/응답만 처리하고, 실제 로직은 Service에 위임합니다.

---

## Service Orchestration Patterns

### 1. 주문 생성 흐름
```
OrderController.create()
  → AuthMiddleware (세션 검증)
  → OrderService.createOrder()
    → OrderService.calculateTotalAmount()
    → Prisma: Order + OrderItems 생성 (트랜잭션)
    → SSE: broadcast('new-order', order)
  → Response: { order, orderNumber }
```

### 2. 주문 상태 변경 흐름
```
OrderController.updateStatus()
  → AuthMiddleware (관리자 검증)
  → OrderService.updateOrderStatus()
    → 상태 전이 검증 (pending → preparing → completed)
    → Prisma: Order 상태 업데이트
    → SSE: broadcast('order-status-changed', { orderId, status })
  → Response: { order }
```

### 3. 테이블 이용 완료 흐름
```
TableController.complete()
  → AuthMiddleware (관리자 검증)
  → TableService.completeTable()
    → Prisma 트랜잭션:
      - TableSession 종료 (endedAt 설정)
      - 관련 Orders → OrderHistory 이동
    → SSE: broadcast('table-completed', { tableId })
  → Response: { success }
```

### 4. 테이블 로그인 흐름
```
AuthController.loginTable()
  → AuthService.loginTable()
    → Table 조회 (storeId + tableNumber)
    → 비밀번호 검증
    → 활성 세션 확인/생성
    → JWT 토큰 생성 (role: 'customer', tableId, sessionId)
  → Response: { token, tableId, sessionId }
```

### 5. 관리자 로그인 흐름
```
AuthController.loginAdmin()
  → AuthService.checkLoginAttempts()
  → AuthService.loginAdmin()
    → Admin 조회 (storeId + username)
    → bcrypt 비밀번호 비교
    → JWT 토큰 생성 (role: 'admin', adminId, storeId)
  → Response: { token, admin }
```

---

## Service Dependencies

| Service | 의존 대상 |
|---------|-----------|
| AuthService | Prisma (Admin, Table, TableSession), bcrypt, jsonwebtoken |
| MenuService | Prisma (Menu, Category) |
| OrderService | Prisma (Order, OrderItem), SSE broadcast |
| TableService | Prisma (Table, TableSession, Order), SSE broadcast |
| CategoryService | Prisma (Category) |

---

## Cross-Cutting Concerns

### SSE Event Broadcasting
- OrderService와 TableService에서 상태 변경 시 SSE 이벤트 발행
- better-sse 라이브러리의 Channel 기능으로 관리자 클라이언트에 broadcast
- 이벤트 타입: `new-order`, `order-status-changed`, `order-deleted`, `table-completed`

### Transaction Management
- Prisma의 `$transaction` 사용
- 주문 생성 (Order + OrderItems 동시)
- 테이블 이용 완료 (Session 종료 + History 이동)

### Error Handling
- Service에서 비즈니스 에러 throw (커스텀 에러 클래스)
- 글로벌 에러 핸들러에서 HTTP 응답으로 변환
- 에러 클래스: `NotFoundError`, `UnauthorizedError`, `ValidationError`, `ConflictError`
