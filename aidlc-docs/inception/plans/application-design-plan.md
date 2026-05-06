# Application Design Plan

## Overview
테이블오더 서비스의 고수준 컴포넌트 식별 및 서비스 레이어 설계 계획서입니다.
요구사항 문서를 기반으로 컴포넌트, 메서드, 서비스, 의존성을 정의합니다.

---

## Execution Checklist

### Phase 1: Component Identification
- [x] Backend 컴포넌트 식별 및 책임 정의
- [x] Frontend 컴포넌트 식별 및 책임 정의
- [x] Database 엔티티/레포지토리 레이어 정의
- [x] components.md 생성

### Phase 2: Component Methods
- [x] 각 Backend 컴포넌트의 메서드 시그니처 정의
- [x] 각 Frontend 컴포넌트의 주요 인터페이스 정의
- [x] Input/Output 타입 정의
- [x] component-methods.md 생성

### Phase 3: Service Layer Design
- [x] 서비스 정의 및 오케스트레이션 패턴
- [x] 서비스 간 상호작용 정의
- [x] services.md 생성

### Phase 4: Component Dependencies
- [x] 의존성 매트릭스 생성
- [x] 통신 패턴 정의
- [x] 데이터 흐름 다이어그램
- [x] component-dependency.md 생성

### Phase 5: Consolidation
- [x] application-design.md 통합 문서 생성
- [x] 설계 완전성 및 일관성 검증

---

## Questions for Application Design

아래 질문에 답변해주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해주세요.

---

## Question 1
Backend 아키텍처 레이어 구조를 어떻게 하시겠습니까?

A) 3-Layer - Controller → Service → Repository (간결한 구조)
B) 4-Layer - Controller → Service → Domain → Repository (도메인 로직 분리)
C) Clean Architecture - Controller → UseCase → Entity → Gateway (의존성 역전)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
Frontend 컴포넌트 구조를 어떻게 하시겠습니까?

A) Feature 기반 - features/auth, features/menu, features/order, features/admin 폴더 구조
B) Atomic Design - atoms, molecules, organisms, templates, pages 계층
C) Page 기반 - pages/ 아래 각 페이지별 컴포넌트 그룹핑
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
상태 관리 방식을 어떻게 하시겠습니까?

A) React Context + useReducer (외부 라이브러리 없이)
B) Zustand (경량 상태 관리)
C) Redux Toolkit (구조화된 상태 관리)
D) React Query/TanStack Query만 (서버 상태 중심)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
API 통신 레이어를 어떻게 구성하시겠습니까?

A) Axios + 커스텀 API 클라이언트 클래스
B) Fetch API + 커스텀 래퍼 함수
C) React Query + Axios (캐싱/재시도 자동화)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 5
데이터베이스 접근 방식을 어떻게 하시겠습니까?

A) ORM 사용 - Prisma (타입 안전, 마이그레이션 자동화)
B) ORM 사용 - TypeORM (데코레이터 기반, Active Record/Data Mapper)
C) Query Builder - Knex.js (SQL에 가까운 유연성)
D) Raw SQL + pg 드라이버 (최대 제어)
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6
인증/인가 미들웨어 구조를 어떻게 하시겠습니까?

A) 단일 미들웨어 - 하나의 auth 미들웨어에서 고객/관리자 모두 처리
B) 분리 미들웨어 - customerAuth, adminAuth 별도 미들웨어
C) Guard 패턴 - 역할 기반 Guard (role: 'customer' | 'admin')
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
SSE(Server-Sent Events) 구현 방식을 어떻게 하시겠습니까?

A) Express 직접 구현 - res.write()로 직접 SSE 스트림 관리
B) 라이브러리 사용 - better-sse 등 SSE 전용 라이브러리
C) EventEmitter 패턴 - Node.js EventEmitter + SSE 연결 관리자 클래스
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 8
에러 처리 전략을 어떻게 하시겠습니까?

A) 중앙 집중 - 글로벌 에러 핸들러 미들웨어 + 커스텀 에러 클래스 계층
B) 분산 처리 - 각 컨트롤러/서비스에서 개별 try-catch
C) Result 패턴 - 성공/실패를 명시적 타입으로 반환 (Either/Result 패턴)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 9
Monorepo 패키지 관리 도구를 어떻게 하시겠습니까?

A) npm workspaces (추가 도구 없이 기본 npm 기능)
B) Turborepo (빌드 캐싱, 병렬 실행)
C) pnpm workspaces (디스크 효율, 엄격한 의존성)
D) Nx (고급 의존성 그래프, 영향 분석)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Notes
- 답변 완료 후 알려주시면 분석 후 Application Design 아티팩트를 생성합니다.
- 모든 [Answer]: 태그에 선택지 문자(A, B, C 등)를 입력해주세요.
