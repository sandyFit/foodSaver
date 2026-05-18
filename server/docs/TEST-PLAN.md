# Test Plan — FoodSaver API

**Version:** 1.0.0
**Status:** Draft
**Last updated:** 2026-05-18
**Author:** Trish
**Related documents:** `docs/SRS.md`, `docs/BLS.md`, `docs/ARCH.md`, `docs/TEST-COVERAGE.md`

---

## Table of contents

1. [Introduction](#1-introduction)
2. [Scope](#2-scope)
3. [Test strategy](#3-test-strategy)
4. [Test environment](#4-test-environment)
5. [Test execution approach](#5-test-execution-approach)
6. [Coverage summary](#6-coverage-summary)
7. [Entry and exit criteria](#7-entry-and-exit-criteria)
8. [Risk and mitigation](#8-risk-and-mitigation)
9. [Sprint plan](#9-sprint-plan)
10. [Defect management](#10-defect-management)

---

## 1. Introduction

This test plan describes the testing strategy, scope, approach, and schedule for the FoodSaver API testing project. It covers the API test framework built with Jest, Supertest, and mongodb-memory-server targeting the Node.js/Express/MongoDB backend.

The goal is to demonstrate production-quality test engineering practice — including requirement traceability, boundary value analysis, data integrity checks, contract testing, and CI/CD integration — suitable for a professional automation testing portfolio.

---

## 2. Scope

### In scope

| Area | Coverage |
|---|---|
| Authentication API | Registration, login, logout, JWT enforcement |
| Pantry management API | CRUD operations, ownership isolation, validation |
| Expiry notifications API | Window logic, state persistence, user scoping |
| Recipe recommendations API | Matching algorithm, edge cases, user scoping |
| Security | Password storage, token security, user enumeration |
| Reliability | Error response consistency, input validation |
| Contract testing | Consumer-driven contracts via Pact JS |
| Component testing | Service-layer isolation with mocked dependencies |
| CI/CD integration | GitHub Actions pipeline with coverage gates |

### Out of scope — this phase

| Area | Reason |
|---|---|
| Frontend (React) E2E | Planned for Phase 2 using Playwright |
| Performance/load testing | Planned for Phase 3 using k6 — blocked on TBD-7.3 |
| Mobile testing | Not applicable |
| Accessibility testing | Frontend only |

---

## 3. Test Strategy

### 3.1 Test Pyramid

The test suite follows a **test pyramid** approach: broad API coverage at the base, focused contract and component tests in the middle, and a smaller set of end-to-end (E2E) tests at the top.

The goal is to maximize confidence while keeping execution time and maintenance costs manageable.

* **API tests** form the foundation of the suite.
  The 58 API tests provide the highest confidence at the lowest cost by validating system behavior through real HTTP requests and responses.

* **Contract tests** verify the agreement between the backend and frontend.
  These tests answer a narrower question: *does the API still return the response shape expected by the React client?*
  Since behavior is already covered by API tests, only one contract test is needed per frontend-dependent response shape. Contract tests are more expensive to maintain because they require Pact brokers, provider states, and coordination between consumer and provider suites, so they are used only where the integration risk justifies the cost.

* **Isolated/Component tests** Isolated logic tests are fast and inexpensive, but provide less system-level confidence than API or E2E tests.

  They are most useful for:

  * **Complex logic that is difficult to test through HTTP**
    For example, the notification status mapping (`daysUntilExpiry → EXPIRING_SOON / EXPIRING_TODAY / EXPIRED`) includes six boundary cases. Testing all scenarios through the API would require creating products, sending requests, and validating responses. As a component test, the same logic can be validated quickly in a single test suite.

  * **Logic bugs that are easier to isolate directly**
    DEF-007 (24-hour periods vs calendar days) was caused by an issue in the date calculation function itself. While the API test detects the symptom, the component test validates the exact function inputs and outputs, helping catch the root cause earlier.

* **E2E tests** provide confidence that the full system works together from the user’s perspective.
  These tests cover critical user journeys across the frontend, backend, and database, validating integrations and deployment-level behavior, but they are slower and more expensive to maintain.
  They are kept intentionally small and focused on high-value scenarios such as creating notifications, filtering products, and handling expiration workflows.

```
text id="q8vr1l"
         /\
        /E2E\          ← Critical user flows (Playwright)
       /------\
      /Contract\       ← 10 tests (Pact JS)
     /----------\
    / Component  \     ← 7 tests (Jest + MSW)
   /--------------\
  /   API tests    \   ← 58 tests (Jest + Supertest)
 /------------------\

```


### 3.2 Test types

**API tests — Jest + Supertest**
Full request lifecycle tests against the real Express app with an in-memory MongoDB instance. Each test exercises the complete stack from HTTP request to database operation. These are the primary validation layer.

Key principles:
- Every test references a REQ-XXX-XXX in a comment
- Boundary value analysis applied to all date comparisons and thresholds
- Ownership isolation verified in every mutation endpoint
- Error response shape validated on every 4xx/5xx case

**Contract tests — Pact JS**
Consumer-driven contract tests that verify the React client's expectations of the API response shapes. The React app (consumer) defines the contract; the Express API (provider) verifies it. Contracts are published to a Pact broker on every CI run.

Contracts are defined for:
- Response shapes (field names, types, required fields)
- Error response consistency
- Authentication cookie presence

**Component tests — Jest + MSW**
Service-layer tests that isolate business logic from infrastructure. MongoDB is mocked via MSW or Jest mocks. Used for logic-heavy units where database round-trips would slow feedback: notification window calculation, recipe matching algorithm, password complexity rules.

### 3.3 Test data strategy

All test data is generated using `@faker-js/faker` via the `dataFactory` helper. Key principles:

- No hardcoded test data except for boundary value cases where exact values matter
- Each test creates its own data — no shared state between tests
- Collections cleared after each test file via `jest.setup.ts`
- `NOTIFICATION_BOUNDARY` helpers pre-built for the 7-day window boundary cases

### 3.4 Isolation strategy

- Each test file gets its own `ApiClient` instance (separate cookie jar)
- MongoDB collections cleared after each test file via `afterEach` in `jest.setup.ts`
- `mongodb-memory-server` provides a fresh MongoDB binary per test run
- No shared user accounts or product IDs across test files

---

## 4. Test environment

| Component | Value |
|---|---|
| Test runner | Jest 29.x |
| HTTP client | Supertest 7.x |
| Database | mongodb-memory-server 9.x (in-memory) |
| Contract testing | Pact JS |
| Data generation | @faker-js/faker 8.x |
| Language | TypeScript 5.x via ts-jest |
| Node.js | 20.x LTS |
| CI platform | GitHub Actions (ubuntu-latest) |

**Environment variables required:**

| Variable | Set by | Purpose |
|---|---|---|
| `TEST_MONGO_URI` | `globalSetup.ts` | In-memory MongoDB connection string |
| `NODE_ENV` | CI workflow | Ensures server runs in test mode |
| `JWT_SECRET` | `.env.test` | Token signing — must not be production secret |

---

## 5. Test execution approach

### 5.1 Running tests locally

```bash
# All tests
cd tests/api && npm test

# Single domain
npm run test:auth
npm run test:pantry
npm run test:notifications
npm run test:recipes

# With coverage
npm run test:coverage

# Watch mode during development
npm run test:watch
```

### 5.2 CI execution

Tests run automatically on every push to `develop` or `main`, and on every pull request targeting those branches. The pipeline:

1. Installs dependencies
2. Builds the TypeScript server
3. Runs the full test suite with coverage (`--runInBand` to avoid port conflicts)
4. Enforces coverage thresholds (80% minimum)
5. Uploads coverage report as a build artifact
6. Posts a coverage summary comment on pull requests

A PR cannot be merged if any test fails or if coverage drops below 80%.

### 5.3 Test naming convention

All test files follow the pattern: `{domain}.test.ts`
All test case IDs follow: `TC-{DOMAIN}-{NNN}` for API, `TC-{DOMAIN}-C{NNN}` for contract, `TC-{DOMAIN}-CM{NNN}` for component.

Every `it()` block starts with its TC ID:
```ts
it('TC-AUTH-001 — register with valid data returns 201', async () => {
```

---

## 6. Coverage summary

Full details in `docs/TEST-COVERAGE.md`. Summary as of this version:

| Domain | Total TCs | High priority | Status |
|---|---|---|---|
| Authentication | 18 | 16 | In progress — Sprint 1 |
| Pantry | 22 | 20 | Planned — Sprint 2 |
| Notifications | 15 | 12 | Planned — Sprint 3 |
| Recipes | 13 | 10 | Planned — Sprint 4 |
| Security | 4 | 3 | In progress — Sprint 1 |
| Reliability | 3 | 3 | Planned — Sprint 2 |
| Performance | 2 | 0 | Blocked — TBD-7.3 |
| **Total** | **77** | **64** | — |

**Open Critical defects blocking release:** 1 (DEF-003 — password hash exposure)

---

## 7. Entry and exit criteria

### Entry criteria — begin testing a domain

- [ ] SRS requirements for the domain are complete (no unresolved TBDs blocking tests)
- [ ] BLS rules for the domain are documented
- [ ] Server endpoints for the domain are implemented and accessible
- [ ] Core helpers (`apiClient`, `authHelper`, `dataFactory`) are available
- [ ] Test database is configured and accessible

### Exit criteria — domain testing complete

- [ ] All planned test cases for the domain written and executed
- [ ] All High priority tests passing
- [ ] No Critical or High defects open for this domain
- [ ] Coverage threshold met (≥ 80% for affected server files)
- [ ] Contract tests published to Pact broker
- [ ] Test cases updated in `TEST-COVERAGE.md`
- [ ] Defects logged in Jira and `DEFECT-LOG.md`

### Release exit criteria

- [ ] All 77 planned test cases executed
- [ ] Pass rate ≥ 95%
- [ ] Zero open Critical defects
- [ ] Zero open High defects
- [ ] Code coverage ≥ 80%
- [ ] All blocked tests either resolved or formally deferred with documented rationale
- [ ] `TEST-COVERAGE.md` release readiness table fully green

---

## 8. Risk and mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| DEF-003 open at release | Medium | Critical | Blocked on dev team — escalated, scheduled Sprint 5 |
| TBD-7.1 (logout) not resolved | Low | Medium | TC-AUTH-016 documented as Blocked — acceptable to defer to Phase 2 |
| TBD-7.3 (load targets) not defined | Medium | Low | Performance tests deferred — not blocking API test phase |
| Recipe DB too small for meaningful tests | High | Medium | Expand to 30+ recipes before Sprint 4 — tracked in backlog |
| Timezone bugs in date comparison | High | High | All date tests use UTC via `toDateString()` helper — see DEF-007 |
| Test flakiness from shared state | Low | Medium | Mitigated by per-file collection teardown in `jest.setup.ts` |

---

## 9. Sprint plan

| Sprint | Domain | Key deliverables | Definition of done |
|---|---|---|---|
| Sprint 1 | Auth + Framework | Core helpers, auth test suite (TC-AUTH-001 to TC-AUTH-016), CI pipeline | All auth tests green, pipeline running on PRs |
| Sprint 2 | Pantry | Pantry test suite (TC-PAN-001 to TC-PAN-018), reliability tests | DEF-003 fixed, all pantry tests green |
| Sprint 3 | Notifications | Notification tests (TC-NOT-001 to TC-NOT-009), component tests | DEF-007 and DEF-008 fixed, notification tests green |
| Sprint 4 | Recipes + Contracts | Recipe tests (TC-REC-001 to TC-REC-008), all contract tests, Pact broker | DEF-009 fixed, contracts published |
| Sprint 5 | Hardening | Security tests, reliability tests, coverage gaps, defect validation | Release criteria met, TEST-COVERAGE.md green |

---

## 10. Defect management

### Severity definitions

| Severity | Definition | Target resolution |
|---|---|---|
| Critical | System unusable or data corrupted — blocks release | Same sprint |
| High | Core functionality broken, no workaround | Next sprint |
| Medium | Feature works incorrectly, workaround exists | Within 2 sprints |
| Low | Minor or cosmetic — negligible impact | Backlog |

### Defect lifecycle

```
New → In progress → Fixed → Verified → Closed
               ↓
          Won't fix (requires documented rationale)
```

All defects are logged in Jira (`FS` project) and summarised in `docs/DEFECT-LOG.md`. A defect is not considered fixed until the corresponding test case passes in CI.

### Current open defects

| ID | Severity | Title | Sprint |
|---|---|---|---|
| DEF-003 | Critical | Password hash exposed in register response | Sprint 5 |
| DEF-004 | High | Past expiry date accepted at midnight UTC | Sprint 3 |
| DEF-007 | High | Notification window uses 24h periods not calendar days | Sprint 3 |
| DEF-009 | High | Recipe match is case-sensitive | Sprint 4 |
| DEF-006 | Medium | GET /pantry returns 404 instead of empty array | Sprint 2 |
| DEF-008 | Medium | Expired products missing status field | Sprint 3 |

---

*This document is version-controlled alongside the codebase. Update sprint status, coverage summary, and open defects at the end of each sprint.*
