# 요구사항 명확화 질문

아래 질문에 답변해 주세요. 각 질문의 `[Answer]:` 태그 뒤에 선택한 옵션의 알파벳을 입력해 주세요.
"Other"를 선택한 경우, `[Answer]:` 태그 뒤에 설명을 추가해 주세요.

---

## Question 1
Backend 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Node.js + Express (JavaScript/TypeScript)
B) Node.js + NestJS (TypeScript)
C) Python + FastAPI
D) Java + Spring Boot
E) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
Frontend 기술 스택으로 어떤 것을 사용하시겠습니까?

A) React (TypeScript)
B) Vue.js (TypeScript)
C) Next.js (React 기반 풀스택 프레임워크)
D) Nuxt.js (Vue 기반 풀스택 프레임워크)
E) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL (관계형 DB)
B) MySQL (관계형 DB)
C) MongoDB (NoSQL Document DB)
D) DynamoDB (AWS NoSQL)
E) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
배포 환경은 어디를 대상으로 하시겠습니까?

A) AWS (EC2, ECS, Lambda 등)
B) 로컬 개발 환경만 (Docker Compose 등)
C) Vercel/Netlify (Frontend) + AWS (Backend)
D) 온프레미스 서버
E) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
고객용 인터페이스와 관리자용 인터페이스를 어떻게 구성하시겠습니까?

A) 하나의 Frontend 프로젝트에서 라우팅으로 분리
B) 별도의 Frontend 프로젝트로 분리 (고객용 / 관리자용)
C) 관리자용은 별도 프로젝트, 고객용은 서버 사이드 렌더링
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
프로젝트 구조를 어떻게 구성하시겠습니까?

A) Monorepo (Frontend + Backend 하나의 저장소)
B) 별도 저장소 (Frontend / Backend 분리)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7
메뉴 이미지 저장은 어떻게 처리하시겠습니까? (요구사항에 이미지 URL 필드가 있음)

A) 외부 이미지 URL만 지원 (직접 업로드 없음)
B) 로컬 파일 시스템에 저장
C) AWS S3 등 클라우드 스토리지에 업로드
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 8
매장(Store) 관리 범위는 어떻게 되나요? (멀티 테넌시)

A) 단일 매장만 지원 (MVP)
B) 다중 매장 지원 (각 매장이 독립적으로 운영)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9
관리자 계정 생성은 어떻게 처리하시겠습니까?

A) 시스템 초기 설정 시 seed 데이터로 생성 (회원가입 없음)
B) 관리자 회원가입 기능 포함
C) CLI 또는 스크립트로 관리자 계정 생성
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10
개발 우선순위 및 접근 방식은 어떻게 하시겠습니까?

A) Backend API 먼저 개발 후 Frontend 개발
B) Frontend와 Backend 동시 개발 (Mock API 활용)
C) 풀스택으로 기능 단위 개발 (한 기능의 Frontend + Backend 함께)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 11: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용하시겠습니까?

A) Yes — 모든 SECURITY 규칙을 blocking constraint로 적용 (프로덕션 수준 애플리케이션에 권장)
B) No — 모든 SECURITY 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 12: Property-Based Testing Extension
이 프로젝트에 Property-Based Testing (PBT) 규칙을 적용하시겠습니까?

A) Yes — 모든 PBT 규칙을 blocking constraint로 적용 (비즈니스 로직, 데이터 변환, 직렬화, 상태 관리 컴포넌트가 있는 프로젝트에 권장)
B) Partial — 순수 함수와 직렬화 round-trip에만 PBT 규칙 적용 (제한된 알고리즘 복잡성을 가진 프로젝트에 적합)
C) No — 모든 PBT 규칙 건너뛰기 (단순 CRUD 애플리케이션, UI 전용 프로젝트에 적합)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---
