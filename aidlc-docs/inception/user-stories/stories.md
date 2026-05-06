# User Stories

## Story Format
- Feature 기반 분류
- 중간 단위 세분화 (~15-20개)
- 간결한 Acceptance Criteria (핵심 조건 2-3개 + 에러 케이스)
- 우선순위: 사용자 가치 기반 (핵심 주문 흐름 > 관리 기능 > 부가 기능)

---

## Feature: 인증 (Authentication)

### US-01: 테이블 태블릿 자동 로그인

**As a** 식당 방문 고객,
**I want to** 테이블 태블릿이 자동으로 로그인되어 있기를,
**So that** 별도 조작 없이 바로 메뉴를 보고 주문할 수 있다.

**Acceptance Criteria:**
- [ ] 태블릿 접속 시 저장된 인증 정보로 자동 로그인되어 메뉴 화면이 표시된다
- [ ] 초기 설정(매장 ID, 테이블 번호, 비밀번호)은 관리자가 1회 수행한다
- [ ] 인증 실패 시 로그인 화면이 표시되고 에러 메시지를 보여준다

**Priority**: High
**Related Requirements**: FR-C01

---

### US-02: 관리자 로그인

**As a** 매장 관리자,
**I want to** 매장 ID와 계정 정보로 로그인하기를,
**So that** 관리자 기능에 안전하게 접근할 수 있다.

**Acceptance Criteria:**
- [ ] 매장 ID + 사용자명 + 비밀번호로 로그인하면 JWT 토큰이 발급된다
- [ ] 로그인 후 16시간 동안 세션이 유지되며 새로고침해도 로그아웃되지 않는다
- [ ] 잘못된 자격 증명 입력 시 에러 메시지가 표시되고 로그인 시도가 제한된다

**Priority**: High
**Related Requirements**: FR-A01

---

## Feature: 메뉴 (Menu)

### US-03: 메뉴 목록 조회

**As a** 식당 방문 고객,
**I want to** 카테고리별로 메뉴를 탐색하기를,
**So that** 원하는 메뉴를 빠르게 찾을 수 있다.

**Acceptance Criteria:**
- [ ] 메뉴 화면에 카테고리별로 메뉴가 카드 형태로 표시된다 (메뉴명, 가격, 이미지)
- [ ] 카테고리 간 빠른 이동이 가능하다
- [ ] 메뉴 로딩 실패 시 재시도 버튼과 에러 메시지가 표시된다

**Priority**: High
**Related Requirements**: FR-C02

---

### US-04: 메뉴 상세 조회

**As a** 식당 방문 고객,
**I want to** 메뉴의 상세 정보(설명, 이미지)를 확인하기를,
**So that** 주문 전에 메뉴에 대해 충분히 파악할 수 있다.

**Acceptance Criteria:**
- [ ] 메뉴 카드 터치 시 메뉴명, 가격, 설명, 이미지가 포함된 상세 화면이 표시된다
- [ ] 상세 화면에서 바로 장바구니에 추가할 수 있다

**Priority**: Medium
**Related Requirements**: FR-C02

---

### US-05: 메뉴 등록/수정

**As a** 매장 관리자,
**I want to** 메뉴를 등록하고 수정하기를,
**So that** 매장의 메뉴 정보를 최신 상태로 유지할 수 있다.

**Acceptance Criteria:**
- [ ] 메뉴명, 가격, 설명, 카테고리, 이미지 URL을 입력하여 메뉴를 등록할 수 있다
- [ ] 기존 메뉴의 정보를 수정할 수 있다
- [ ] 필수 필드 미입력 또는 가격 범위 초과 시 유효성 검증 에러가 표시된다

**Priority**: High
**Related Requirements**: FR-A04

---

### US-06: 메뉴 삭제 및 순서 조정

**As a** 매장 관리자,
**I want to** 메뉴를 삭제하고 노출 순서를 조정하기를,
**So that** 고객에게 보여줄 메뉴를 관리할 수 있다.

**Acceptance Criteria:**
- [ ] 메뉴를 삭제할 수 있으며 삭제 후 목록에서 즉시 제거된다
- [ ] 메뉴의 노출 순서를 드래그 또는 버튼으로 조정할 수 있다

**Priority**: Medium
**Related Requirements**: FR-A04

---

## Feature: 장바구니 (Cart)

### US-07: 장바구니에 메뉴 추가

**As a** 식당 방문 고객,
**I want to** 원하는 메뉴를 장바구니에 담기를,
**So that** 여러 메뉴를 모아서 한 번에 주문할 수 있다.

**Acceptance Criteria:**
- [ ] 메뉴 선택 시 장바구니에 추가되고 총 금액이 실시간으로 계산된다
- [ ] 장바구니는 클라이언트에 로컬 저장되어 새로고침해도 유지된다
- [ ] 동일 메뉴 추가 시 수량이 증가한다

**Priority**: High
**Related Requirements**: FR-C03

---

### US-08: 장바구니 수정

**As a** 식당 방문 고객,
**I want to** 장바구니의 메뉴 수량을 조절하거나 삭제하기를,
**So that** 주문 전에 원하는 대로 조정할 수 있다.

**Acceptance Criteria:**
- [ ] 수량 증가/감소 버튼으로 수량을 조절할 수 있다
- [ ] 개별 메뉴 삭제 및 장바구니 전체 비우기가 가능하다
- [ ] 수량 변경 시 총 금액이 즉시 재계산된다

**Priority**: High
**Related Requirements**: FR-C03

---

## Feature: 주문 (Order)

### US-09: 주문 생성

**As a** 식당 방문 고객,
**I want to** 장바구니의 메뉴를 최종 확인하고 주문을 확정하기를,
**So that** 주방에 주문이 전달된다.

**Acceptance Criteria:**
- [ ] 주문 확정 시 주문 번호가 표시되고 장바구니가 비워지며 5초 후 메뉴 화면으로 리다이렉트된다
- [ ] 주문 정보에 매장 ID, 테이블 ID, 메뉴 목록, 총 금액, 세션 ID가 포함된다
- [ ] 주문 실패 시 에러 메시지가 표시되고 장바구니가 유지된다

**Priority**: High
**Related Requirements**: FR-C04

---

### US-10: 주문 내역 조회

**As a** 식당 방문 고객,
**I want to** 현재 테이블 세션의 주문 내역을 확인하기를,
**So that** 이전에 주문한 내용과 상태를 파악할 수 있다.

**Acceptance Criteria:**
- [ ] 현재 세션의 주문만 시간 순으로 표시된다 (주문 번호, 시각, 메뉴/수량, 금액, 상태)
- [ ] 주문 상태(대기중/준비중/완료)가 표시된다
- [ ] 이용 완료 처리된 이전 세션의 주문은 표시되지 않는다

**Priority**: Medium
**Related Requirements**: FR-C05

---

### US-11: 주문 상태 변경

**As a** 매장 관리자,
**I want to** 주문의 상태를 변경하기를 (대기중 → 준비중 → 완료),
**So that** 주문 처리 진행 상황을 고객과 공유할 수 있다.

**Acceptance Criteria:**
- [ ] 주문 상태를 대기중 → 준비중 → 완료 순서로 변경할 수 있다
- [ ] 상태 변경 시 고객 화면에 실시간으로 반영된다
- [ ] 잘못된 상태 전이(예: 완료 → 대기중) 시 에러가 표시된다

**Priority**: High
**Related Requirements**: FR-A02

---

### US-12: 주문 삭제

**As a** 매장 관리자,
**I want to** 잘못된 주문을 삭제하기를,
**So that** 주문 목록을 정확하게 유지할 수 있다.

**Acceptance Criteria:**
- [ ] 삭제 전 확인 팝업이 표시된다
- [ ] 삭제 후 해당 테이블의 총 주문액이 재계산된다

**Priority**: Medium
**Related Requirements**: FR-A03

---

## Feature: 주문 모니터링 (Order Monitoring + SSE)

### US-13: 실시간 주문 대시보드

**As a** 매장 관리자,
**I want to** 테이블별 주문 현황을 실시간 대시보드로 확인하기를,
**So that** 매장 전체 상황을 한눈에 파악하고 빠르게 대응할 수 있다.

**Acceptance Criteria:**
- [ ] 테이블별 카드에 테이블 번호, 총 주문액, 최신 주문 미리보기가 표시된다
- [ ] 신규 주문 발생 시 2초 이내에 대시보드에 반영되며 시각적으로 강조된다
- [ ] 카드 클릭 시 해당 테이블의 전체 주문 목록 상세가 표시된다

**Priority**: High
**Related Requirements**: FR-A02

---

### US-14: 실시간 주문 알림 수신

**As a** 매장 관리자,
**I want to** SSE를 통해 신규 주문 알림을 실시간으로 받기를,
**So that** 주문이 들어오는 즉시 확인하고 처리할 수 있다.

**Acceptance Criteria:**
- [ ] SSE 연결이 유지되며 신규 주문/상태 변경 이벤트가 실시간으로 수신된다
- [ ] 연결 끊김 시 자동 재연결을 시도한다
- [ ] 네트워크 오류 시 연결 상태 표시가 변경된다

**Priority**: High
**Related Requirements**: FR-A02, NFR-01

---

## Feature: 테이블 관리 (Table Management)

### US-15: 테이블 초기 설정

**As a** 매장 관리자,
**I want to** 테이블의 번호와 비밀번호를 설정하고 세션을 시작하기를,
**So that** 고객이 해당 테이블에서 주문할 수 있도록 준비한다.

**Acceptance Criteria:**
- [ ] 테이블 번호와 비밀번호를 설정하면 16시간 세션이 생성된다
- [ ] 설정 완료 후 해당 테이블 태블릿에서 자동 로그인이 가능해진다

**Priority**: High
**Related Requirements**: FR-A03

---

### US-16: 테이블 이용 완료

**As a** 매장 관리자,
**I want to** 고객 퇴장 시 테이블을 이용 완료 처리하기를,
**So that** 다음 고객을 위해 테이블이 초기화된다.

**Acceptance Criteria:**
- [ ] 이용 완료 확인 팝업 후 세션이 종료되고 주문 내역이 과거 이력으로 이동된다
- [ ] 이용 완료 후 해당 테이블이 리셋 상태로 표시된다
- [ ] 이용 완료된 테이블의 주문은 고객 화면에서 더 이상 표시되지 않는다

**Priority**: High
**Related Requirements**: FR-A03

---

### US-17: 과거 주문 내역 조회

**As a** 매장 관리자,
**I want to** 테이블별 과거 주문 내역을 조회하기를,
**So that** 이전 영업 기록을 확인할 수 있다.

**Acceptance Criteria:**
- [ ] 테이블별 과거 주문 목록이 시간 역순으로 표시된다
- [ ] 날짜 필터링으로 특정 기간의 내역을 조회할 수 있다

**Priority**: Low
**Related Requirements**: FR-A03

---

## Story Summary

| 우선순위 | 스토리 수 | 스토리 ID |
|----------|-----------|-----------|
| High | 11 | US-01, 02, 03, 05, 07, 08, 09, 11, 13, 14, 15, 16 |
| Medium | 4 | US-04, 06, 10, 12 |
| Low | 1 | US-17 |
| **Total** | **17** | |

## Persona-Story Mapping

| 페르소나 | 스토리 |
|----------|--------|
| 식당 방문 고객 | US-01, 03, 04, 07, 08, 09, 10 |
| 매장 관리자 | US-02, 05, 06, 11, 12, 13, 14, 15, 16, 17 |
