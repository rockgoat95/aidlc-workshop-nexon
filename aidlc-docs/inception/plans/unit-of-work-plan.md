# Unit of Work Plan

## Overview
테이블오더 서비스를 개발 가능한 단위(Unit of Work)로 분해합니다.
Application Design에서 정의한 컴포넌트를 기반으로 개발 순서와 단위를 결정합니다.

---

## Execution Checklist

### Phase 1: Unit Decomposition
- [x] 시스템을 개발 단위로 분해
- [x] 각 단위의 범위와 책임 정의
- [x] unit-of-work.md 생성

### Phase 2: Dependency Mapping
- [x] 단위 간 의존성 매트릭스 생성
- [x] 개발 순서 결정
- [x] unit-of-work-dependency.md 생성

### Phase 3: Story Mapping
- [x] 각 User Story를 단위에 매핑
- [x] 매핑 완전성 검증 (모든 스토리 할당 확인)
- [x] unit-of-work-story-map.md 생성

### Phase 4: Validation
- [x] 단위 경계 검증
- [x] 의존성 순환 없음 확인
- [x] 병렬 개발 가능성 확인

---

## Questions for Unit Decomposition

아래 질문에 답변해주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해주세요.

---

## Question 1
개발 단위(Unit) 분해 기준을 어떻게 하시겠습니까?

A) 기능 도메인 기반 - 인증, 메뉴, 주문, 테이블관리 등 비즈니스 도메인별 단위
B) 레이어 기반 - DB 스키마/API → Backend 서비스 → Frontend UI 순서
C) 풀스택 기능 슬라이스 - 각 단위가 DB+API+UI를 모두 포함 (예: "메뉴 기능" = 메뉴 DB + 메뉴 API + 메뉴 UI)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
개발 단위의 크기(Granularity)를 어떻게 하시겠습니까?

A) 큰 단위 - 3-4개 단위 (예: 기반 설정, 고객 기능, 관리자 기능, 실시간)
B) 중간 단위 - 5-7개 단위 (예: 인증, 메뉴, 장바구니+주문, 주문모니터링, 테이블관리, 메뉴관리)
C) 작은 단위 - 8개 이상 (각 Feature를 독립 단위로)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3
3명 팀의 병렬 작업을 어떻게 구성하시겠습니까?

A) 순차 개발 - 의존성 순서대로 하나씩 (전원이 같은 단위 작업)
B) 파이프라인 - 1명 DB/API, 1명 Frontend, 1명 통합/테스트 (레이어별 분담)
C) 독립 병렬 - 각자 다른 기능 단위를 동시에 개발 (의존성 낮은 것부터)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 4
첫 번째로 개발할 단위(기반 설정)에 무엇을 포함하시겠습니까?

A) 최소 기반 - Monorepo 설정 + DB 스키마 + 인증만 (나머지는 각 단위에서)
B) 풀 기반 - Monorepo + DB + 인증 + 공통 미들웨어 + 에러 처리 + SSE 설정
C) 스켈레톤 - 모든 컴포넌트의 빈 껍데기(라우터, 컨트롤러, 서비스 파일)를 먼저 생성
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5
Frontend와 Backend의 개발 순서를 어떻게 하시겠습니까?

A) Backend 먼저 - API 완성 후 Frontend 개발 (API 계약 확정 후 UI)
B) 동시 개발 - Mock API로 Frontend 먼저 시작, Backend 완성되면 연결
C) Frontend 먼저 - UI/UX 확정 후 Backend를 맞춰서 개발
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Notes
- 답변 완료 후 알려주시면 분석 후 Unit of Work 아티팩트를 생성합니다.
- 모든 [Answer]: 태그에 선택지 문자(A, B, C 등)를 입력해주세요.
