# Unit of Work - Dependency Matrix

## Dependency Matrix

| Unit | Depends On | Depended By |
|------|-----------|-------------|
| Unit 0 (기반 설정) | - | 모든 Unit |
| Unit 1 (인증) | Unit 0 | Unit 2, 3, 4, 5 (인증 미들웨어 사용) |
| Unit 2 (메뉴) | Unit 0, Unit 1 | Unit 3 (메뉴 데이터 참조) |
| Unit 3 (장바구니+주문) | Unit 0, Unit 1, Unit 2 | Unit 4 (주문 데이터 참조) |
| Unit 4 (주문 모니터링) | Unit 0, Unit 1, Unit 3 | - |
| Unit 5 (테이블 관리) | Unit 0, Unit 1 | - |

---

## Dependency Graph

```
Unit 0 (기반 설정)
  │
  ├──→ Unit 1 (인증)
  │      │
  │      ├──→ Unit 2 (메뉴)
  │      │      │
  │      │      └──→ Unit 3 (장바구니+주문)
  │      │             │
  │      │             └──→ Unit 4 (주문 모니터링)
  │      │
  │      └──→ Unit 5 (테이블 관리)
  │
  └──→ (모든 Unit의 공통 기반)
```

---

## 병렬 개발 가능성 분석

### Phase 1 병렬 가능 조합
Unit 0 완료 후, 다음 조합이 병렬 가능:

| 조합 | 가능 여부 | 이유 |
|------|-----------|------|
| Unit 1 + Unit 2 + Unit 3 | ⚠️ 조건부 | Unit 2, 3은 인증 미들웨어 필요 → Unit 1의 미들웨어 부분만 먼저 완성하면 가능 |
| Unit 1 + Unit 2 + Unit 5 | ✅ 가능 | Unit 5는 Unit 1만 의존 |
| Unit 2 + Unit 5 | ✅ 가능 | 서로 독립적 |
| Unit 4 + Unit 5 | ✅ 가능 | 서로 독립적 |

### 권장 병렬 전략

**해결책**: Unit 0에 AuthMiddleware를 포함시켰으므로 (풀 기반 설정), Unit 1/2/3/5 모두 Unit 0 완료 후 바로 병렬 개발 가능.

```
Phase 0: Unit 0 (전원, 1-2일)
    ↓ (AuthMiddleware 포함되어 있으므로)
Phase 1: Unit 1 ∥ Unit 2 ∥ Unit 3 (3명 병렬, 각 3-5일)
    ↓
Phase 2: Unit 4 ∥ Unit 5 (2명 병렬, 각 3-4일)
    ↓
Phase 3: 통합 테스트 (전원, 2-3일)
```

---

## 개발 순서 결정

| 순서 | Unit | 이유 |
|------|------|------|
| 1st | Unit 0 | 모든 Unit의 전제 조건 |
| 2nd (병렬) | Unit 1, 2, 3 | Unit 0에 미들웨어 포함으로 독립 개발 가능 |
| 3rd (병렬) | Unit 4, 5 | Unit 3의 주문 데이터 필요(Unit 4), Unit 1만 필요(Unit 5) |

---

## 순환 의존성 검증

✅ **순환 없음** - 모든 의존성이 단방향 (Unit 0 → 1 → 2 → 3 → 4, Unit 1 → 5)

---

## 통합 포인트

| 통합 지점 | 관련 Unit | 설명 |
|-----------|-----------|------|
| 주문 생성 → SSE 알림 | Unit 3 + Unit 4 | 주문 생성 시 SSE broadcast 연결 |
| 메뉴 데이터 → 장바구니 | Unit 2 + Unit 3 | 메뉴 ID/가격 참조 |
| 테이블 세션 → 주문 격리 | Unit 5 + Unit 3 | 세션 종료 시 주문 이력 이동 |
| 인증 토큰 → 모든 API | Unit 1 + All | JWT 토큰 기반 인증 |
