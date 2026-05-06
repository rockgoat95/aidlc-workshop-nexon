# AI-DLC State Tracking

## Project Information
- **Project Type**: Greenfield
- **Start Date**: 2026-05-06T00:00:00Z
- **Current Stage**: CONSTRUCTION - Code Generation Complete (Bug fixes in progress)

## Workspace State
- **Existing Code**: No
- **Reverse Engineering Needed**: No
- **Workspace Root**: aidlc-workshop

## Code Location Rules
- **Application Code**: Workspace root (NEVER in aidlc-docs/)
- **Documentation**: aidlc-docs/ only
- **Structure patterns**: See code-generation.md Critical Rules

## Extension Configuration
| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | No | Requirements Analysis |
| Property-Based Testing | No | Requirements Analysis |

## Stage Progress
- [x] INCEPTION - Workspace Detection (Greenfield detected)
- [x] INCEPTION - Requirements Analysis
- [x] INCEPTION - User Stories (Complete - 17 stories generated)
- [x] INCEPTION - Workflow Planning (Complete)
- [x] INCEPTION - Application Design (Complete)
- [x] INCEPTION - Units Generation (Complete)
- [x] CONSTRUCTION - Per-Unit Loop (Unit 0-5 Complete, Phase 1-3 Complete)
- [ ] CONSTRUCTION - Build and Test


## Infrastructure Decisions (Changed During Construction)
| Decision | Original | Changed To | Reason |
|----------|----------|-----------|--------|
| Database | PostgreSQL | SQLite | Docker 설치 불가, 로컬 개발 환경 제약 |
| API Base URL | Vite Proxy (/api) | Direct (http://localhost:3001/api) | Turborepo 환경에서 Vite proxy 미동작 |
| Auth Storage | 단일 store | 고객/관리자 분리 | 같은 브라우저에서 동시 테스트 필요 |

## Bug Fixes Applied
1. .gitignore packages/ 규칙 제거
2. Turbo v2 호환 (pipeline → tasks, packageManager 추가)
3. 메뉴 조회 API 인증 제거 (공개 접근)
4. API baseURL 직접 지정 (proxy 우회)
5. Root URL 인증 가드 + 리다이렉트
6. 고객/관리자 세션 분리
7. Admin 라우팅 가드
8. 테이블 로그인 후 navigate 복원
9. 세션 종료 후 주문 격리
10. 이용완료 후 UI 상태 갱신
