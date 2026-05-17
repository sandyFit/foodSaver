# Software Requirements Specification — FoodSaver

**Version:** 1.0.0
**Status:** Draft
**Last updated:** 2026-05-14
**Author:** [Your name]

---

## Table of contents

1. [Introduction](#1-introduction)
2. [Overall description](#2-overall-description)
3. [Functional requirements](#3-functional-requirements)
   - 3.1 [Authentication](#31-authentication)
   - 3.2 [Pantry management](#32-pantry-management)
   - 3.3 [Expiry notifications](#33-expiry-notifications)
   - 3.4 [Recipe engine](#34-recipe-engine)
4. [Non-functional requirements](#4-non-functional-requirements)
   - 4.1 [Performance](#41-performance)
   - 4.2 [Security](#42-security)
   - 4.3 [Reliability](#43-reliability)
5. [Constraints and future scope](#5-constraints-and-future-scope)
6. [Traceability matrix](#6-traceability-matrix)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the functional and non-functional requirements for FoodSaver, a personal food management web application. It serves as the primary reference for test planning, test case design, and acceptance validation.

> **Note on origin:** FoodSaver was developed prior to this document. Requirements have been derived through requirements archaeology — reverse-engineered from the existing implementation, Swagger API documentation, and inferred business rules. Items marked `Source: Inferred` represent implicit behavior discovered in the codebase. Items marked `Status: TBD` represent gaps identified during this process that require a design decision.

### 1.2 Scope

FoodSaver is a full-stack web application that allows users to:

- Create and manage a personal account
- Track food products in their pantry with expiry dates
- Receive notifications when products are approaching expiry
- Get recipe recommendations based on available pantry ingredients

This SRS covers the **backend REST API only**. Frontend (React) requirements are out of scope for this version.

### 1.3 Definitions and acronyms

| Term | Definition |
|---|---|
| Pantry | The collection of food products tracked by a specific user |
| Product | A food item with a name, quantity, and expiry date stored in a user's pantry |
| Expiry window | The number of days before expiry that triggers a notification |
| Match score | A numeric value representing how well a recipe matches a user's current pantry |
| JWT | JSON Web Token — used for stateless authentication |
| SRS | Software Requirements Specification |
| REQ | Requirement identifier prefix |
| TC | Test case identifier prefix |
| TBD | To be determined — a gap requiring a design decision |

### 1.4 System overview

FoodSaver follows a RESTful API architecture built with Node.js and Express, backed by a relational database. The frontend is a React 18 single-page application that consumes the API. Authentication is JWT-based. The system is deployed as a monorepo with `/client` and `/server` directories.

---

## 2. Overall description

### 2.1 User personas

**Primary user — Home cook**
A person managing household food to reduce waste and plan meals. They add products when shopping, expect alerts before food expires, and use recipe suggestions to plan meals around what they already have.

**Secondary user — Developer/evaluator**
A technical user exploring the API directly via Swagger or a REST client. Needs consistent, well-documented error responses.

### 2.2 Assumptions and constraints

- Each user account is associated with exactly one pantry
- All dates are handled in UTC
- The application supports a single language (English) in this version
- Recipe recommendations are based solely on ingredient name matching — no nutritional or dietary logic in this version
- Email delivery for notifications is out of scope for this version; notification state is managed via API only
- The system assumes a single deployment environment (no multi-tenancy)

### 2.3 Dependencies

| Dependency | Purpose |
|---|---|
| Node.js / Express | HTTP server and routing |
| PostgreSQL (or equivalent) | Persistent data storage |
| JWT library | Token generation and validation |
| Cron scheduler | Triggers expiry notification checks |
| Swagger / OpenAPI | API documentation source of truth |

---

## 3. Functional requirements

> **Requirement format:**
> Each requirement includes: ID, title, description, priority (High / Medium / Low), source, acceptance criteria, and linked test cases.
> Priorities: **High** = core functionality, blocking; **Medium** = important but not blocking; **Low** = nice to have.

---

### 3.1 Authentication

---

#### REQ-AUTH-001

**Title:** User registration with valid data

**Description:** The system shall create a new user account when provided with a valid, unique email address and a password that meets complexity requirements.

**Priority:** High

**Source:** POST /auth/register (Swagger)

**Acceptance criteria:**
- Returns HTTP 201 on success
- Response body contains `user` object with `id` and `email` fields
- Response body does not expose the password or password hash
- A corresponding pantry record is created for the new user
- The password is stored as a hash, never in plain text

**Test cases:** TC-AUTH-001, TC-AUTH-002

---

#### REQ-AUTH-002

**Title:** Password complexity enforcement

**Description:** The system shall reject registration attempts where the provided password does not meet minimum complexity requirements.

**Priority:** High

**Source:** Inferred from implementation

**Acceptance criteria:**
- Returns HTTP 400 for passwords shorter than [TBD: minimum length] characters
- Returns HTTP 400 for passwords that do not meet [TBD: complexity rules — uppercase, number, symbol?]
- Response body includes a descriptive error message identifying the failed rule

**Status:** TBD — minimum password rules must be confirmed and documented

**Test cases:** TC-AUTH-003, TC-AUTH-004

---

#### REQ-AUTH-003

**Title:** Duplicate email rejection

**Description:** The system shall reject registration attempts using an email address already associated with an existing account.

**Priority:** High

**Source:** POST /auth/register (Swagger)

**Acceptance criteria:**
- Returns HTTP 409 when the email already exists
- Response body includes error code `DUPLICATE_EMAIL` or equivalent
- No new user record is created in the database

**Test cases:** TC-AUTH-005

---

#### REQ-AUTH-004

**Title:** Email format validation

**Description:** The system shall reject registration attempts with a malformed email address.

**Priority:** High

**Source:** Inferred from implementation

**Acceptance criteria:**
- Returns HTTP 400 for inputs missing `@` or domain component
- Returns HTTP 400 for empty email field
- Returns HTTP 400 when email field is omitted entirely

**Test cases:** TC-AUTH-006, TC-AUTH-007, TC-AUTH-008

---

#### REQ-AUTH-005

**Title:** Successful login

**Description:** The system shall authenticate a user and return a JWT access token when valid credentials are provided.

**Priority:** High

**Source:** POST /auth/login (Swagger)

**Acceptance criteria:**
- Returns HTTP 200 on success
- Response body contains a `token` field with a valid JWT
- Token encodes `userId` and expiry claim (`exp`)
- Response body contains a `user` object with `id` and `email`

**Test cases:** TC-AUTH-009, TC-AUTH-010

---

#### REQ-AUTH-006

**Title:** Login rejection — wrong password

**Description:** The system shall reject login attempts where the password does not match the stored credential for the given email.

**Priority:** High

**Source:** POST /auth/login (Swagger)

**Acceptance criteria:**
- Returns HTTP 401
- Response body does not indicate whether the email exists (prevents user enumeration)
- No token is issued

**Test cases:** TC-AUTH-011

---

#### REQ-AUTH-007

**Title:** Login rejection — non-existent email

**Description:** The system shall reject login attempts for email addresses not associated with any account.

**Priority:** High

**Source:** POST /auth/login (Swagger)

**Acceptance criteria:**
- Returns HTTP 401
- Response is indistinguishable from REQ-AUTH-006 (same message and status code — prevents user enumeration)

**Test cases:** TC-AUTH-012

---

#### REQ-AUTH-008

**Title:** Protected route enforcement

**Description:** The system shall reject requests to protected endpoints when no authentication token is provided.

**Priority:** High

**Source:** Inferred from implementation

**Acceptance criteria:**
- Returns HTTP 401 for requests with no `Authorization` header
- Returns HTTP 401 for requests with a malformed token
- Returns HTTP 401 for requests with an expired token
- Response body includes a descriptive error

**Test cases:** TC-AUTH-013, TC-AUTH-014, TC-AUTH-015

---

#### REQ-AUTH-009

**Title:** Logout

**Description:** The system shall invalidate the current session token upon logout.

**Priority:** Medium

**Source:** POST /auth/logout (Swagger)

**Acceptance criteria:**
- Returns HTTP 200 on success
- Token is invalidated server-side (if blocklist strategy is used) or client is instructed to discard token
- Subsequent requests with the same token are rejected

**Status:** TBD — confirm whether server-side token invalidation is implemented or if logout is client-only

**Test cases:** TC-AUTH-016

---

### 3.2 Pantry management

---

#### REQ-PAN-001

**Title:** Add product to pantry

**Description:** An authenticated user shall be able to add a food product to their pantry with a name, quantity, unit, and expiry date.

**Priority:** High

**Source:** POST /pantry (Swagger)

**Acceptance criteria:**
- Returns HTTP 201 on success
- Response body contains the created product with `id`, `name`, `quantity`, `unit`, `expiryDate`, and `userId`
- Product is associated with the authenticated user's pantry only
- Accepts expiry dates in ISO 8601 format (YYYY-MM-DD)

**Test cases:** TC-PAN-001, TC-PAN-002

---

#### REQ-PAN-002

**Title:** Reject product with missing required fields

**Description:** The system shall reject product creation requests where required fields are absent.

**Priority:** High

**Source:** Inferred from implementation

**Acceptance criteria:**
- Returns HTTP 400 when `name` is missing or empty
- Returns HTTP 400 when `expiryDate` is missing
- Returns HTTP 400 when `quantity` is missing or zero
- Each error response identifies the specific missing field

**Test cases:** TC-PAN-003, TC-PAN-004, TC-PAN-005

---

#### REQ-PAN-003

**Title:** Reject product with past expiry date

**Description:** The system shall reject attempts to add a product whose expiry date is in the past.

**Priority:** Medium

**Source:** Inferred from implementation

**Status:** TBD — confirm whether past expiry dates are rejected at write time or allowed (for tracking already-expired items)

**Acceptance criteria (if rejected):**
- Returns HTTP 422
- Response body includes an error referencing the invalid expiry date

**Test cases:** TC-PAN-006

---

#### REQ-PAN-004

**Title:** Retrieve pantry contents

**Description:** An authenticated user shall be able to retrieve all products currently in their pantry.

**Priority:** High

**Source:** GET /pantry (Swagger)

**Acceptance criteria:**
- Returns HTTP 200
- Response body is an array of product objects
- Array is empty (not an error) when pantry contains no products
- Only returns products belonging to the authenticated user

**Test cases:** TC-PAN-007, TC-PAN-008, TC-PAN-009

---

#### REQ-PAN-005

**Title:** User data isolation

**Description:** The system shall ensure that a user cannot read, modify, or delete products belonging to another user.

**Priority:** High

**Source:** Inferred from implementation

**Acceptance criteria:**
- GET /pantry returns only the authenticated user's products
- PUT /pantry/:id returns HTTP 403 or 404 when the product belongs to another user
- DELETE /pantry/:id returns HTTP 403 or 404 when the product belongs to another user

**Test cases:** TC-PAN-010, TC-PAN-011, TC-PAN-012

---

#### REQ-PAN-006

**Title:** Update product

**Description:** An authenticated user shall be able to update the fields of a product they own.

**Priority:** High

**Source:** PUT /pantry/:id (Swagger)

**Acceptance criteria:**
- Returns HTTP 200 on success with the updated product
- Allows partial updates (only supplied fields are changed)
- Returns HTTP 404 when product ID does not exist
- Returns HTTP 403 or 404 when product belongs to another user

**Test cases:** TC-PAN-013, TC-PAN-014, TC-PAN-015

---

#### REQ-PAN-007

**Title:** Delete product

**Description:** An authenticated user shall be able to remove a product from their pantry.

**Priority:** High

**Source:** DELETE /pantry/:id (Swagger)

**Acceptance criteria:**
- Returns HTTP 200 or 204 on success
- Product no longer appears in subsequent GET /pantry responses
- Returns HTTP 404 when product ID does not exist
- Returns HTTP 403 or 404 when product belongs to another user

**Test cases:** TC-PAN-016, TC-PAN-017, TC-PAN-018

---

### 3.3 Expiry notifications

---

#### REQ-NOT-001

**Title:** Notification triggered within expiry window

**Description:** The system shall generate a notification for any product whose expiry date falls within the configured expiry window from the current date.

**Priority:** High

**Source:** GET /notifications (Swagger)

**Acceptance criteria:**
- Products expiring in exactly 7 days trigger a notification
- Products expiring in fewer than 7 days trigger a notification
- Products expiring in more than 7 days do not trigger a notification
- Expiry window boundary (7 days) is tested as an explicit boundary value

**Status:** TBD — confirm the exact window value (7 calendar days assumed; confirm whether this is configurable per user)

**Test cases:** TC-NOT-001, TC-NOT-002, TC-NOT-003, TC-NOT-004

---

#### REQ-NOT-002

**Title:** Notification triggered for expiry today

**Description:** The system shall generate a notification for products whose expiry date is the current date.

**Priority:** High

**Source:** Inferred from implementation

**Acceptance criteria:**
- A product with `expiryDate = today` appears in notifications
- A product with `expiryDate = yesterday` is handled per REQ-NOT-003

**Test cases:** TC-NOT-005

---

#### REQ-NOT-003

**Title:** Already-expired product handling

**Description:** The system shall define consistent behavior for products whose expiry date has already passed.

**Priority:** Medium

**Source:** Inferred from implementation

**Status:** TBD — confirm expected behavior: are expired products included in notifications (as "expired"), returned separately, or excluded?

**Acceptance criteria (TBD depending on decision):**
- Option A: Expired products appear in notifications with an `EXPIRED` status flag
- Option B: Expired products are excluded from notifications
- Whichever option is chosen, behavior is consistent and documented

**Test cases:** TC-NOT-006

---

#### REQ-NOT-004

**Title:** No duplicate notifications

**Description:** The system shall not generate duplicate notifications for the same product within the same check cycle.

**Priority:** Medium

**Source:** Inferred from implementation

**Status:** TBD — confirm whether notifications are stateful (tracked in DB) or stateless (computed on each request)

**Acceptance criteria:**
- A product triggers at most one notification per check cycle
- If notification state is persisted, re-running the check does not duplicate notifications

**Test cases:** TC-NOT-007

---

#### REQ-NOT-005

**Title:** Notification check is user-scoped

**Description:** A user's notification response shall contain only products from their own pantry.

**Priority:** High

**Source:** Inferred from implementation

**Acceptance criteria:**
- Authenticated user A's notifications do not include any products from user B's pantry
- Response is empty (not an error) when the user has no products in the expiry window

**Test cases:** TC-NOT-008, TC-NOT-009

---

### 3.4 Recipe engine
---

#### REQ-REC-001

**Title:** Recipe recommendations based on pantry ingredients

**Description:** The system shall return a list of recipes for which the user has at least a minimum threshold of required ingredients available in their pantry.

**Priority:** High

**Source:** GET /recipes (Swagger)

**Status:** TBD — confirm minimum match threshold (e.g., does a user need 50% of ingredients? 100%? at least 1?)

**Acceptance criteria:**
- Returns HTTP 200 with an array of recipe objects
- Each recipe includes `id`, `name`, `ingredients`, and `matchScore`
- Only recipes meeting the minimum ingredient threshold are returned
- Ingredient matching is case-insensitive

**Test cases:** TC-REC-001, TC-REC-002

---

#### REQ-REC-002

**Title:** Near-expiry ingredients prioritised in recommendations

**Description:** The system shall prioritise recipes that use ingredients which are within the expiry window, to help users consume food before it spoils.

**Priority:** High

**Source:** Inferred from core product value proposition

**Acceptance criteria:**
- Recipes using near-expiry pantry ingredients rank higher than equivalent recipes using non-expiring ingredients
- `matchScore` or equivalent field reflects the expiry prioritisation
- If no near-expiry ingredients exist, recommendations are still returned based on general pantry match

**Test cases:** TC-REC-003, TC-REC-004

---

#### REQ-REC-003

**Title:** Empty pantry returns no recommendations

**Description:** The system shall return an empty array (not an error) when a user's pantry contains no products.

**Priority:** Medium

**Source:** Inferred from implementation

**Acceptance criteria:**
- Returns HTTP 200 with an empty array `[]`
- Does not return HTTP 4xx or 5xx

**Test cases:** TC-REC-005

---

#### REQ-REC-004

**Title:** No matching recipes returns empty result

**Description:** The system shall return an empty array when no recipe in the database meets the ingredient match threshold for the user's current pantry.

**Priority:** Medium

**Source:** Inferred from implementation

**Acceptance criteria:**
- Returns HTTP 200 with an empty array `[]`
- Does not return HTTP 4xx or 5xx

**Test cases:** TC-REC-006

---

#### REQ-REC-005

**Title:** Recipe result is user-scoped

**Description:** Recipe recommendations shall be based exclusively on the authenticated user's pantry contents.

**Priority:** High

**Source:** Inferred from implementation

**Acceptance criteria:**
- Recommendations change when the user's pantry changes
- Recommendations are not influenced by another user's pantry

**Test cases:** TC-REC-007

---

#### REQ-REC-006

**Title:** Recipe database minimum size

**Description:** The system shall maintain a recipe database large enough to produce meaningful recommendations across varied pantry combinations.

**Priority:** Low

**Source:** Inferred from product value

**Status:** TBD — current database has 8 recipes. Expanding to 30–40 recipes is recommended to enable meaningful test coverage of the recommendation algorithm.

**Acceptance criteria:**
- At minimum 30 recipes with varied ingredient sets
- At least 5 recipes share overlapping ingredients to test ranking logic

**Test cases:** TC-REC-008

---

## 4. Non-functional requirements

---

### 4.1 Performance

---

#### REQ-PERF-001

**Title:** API response time under normal load

**Description:** Core API endpoints shall respond within acceptable time thresholds under normal single-user load.

**Priority:** Medium

**Source:** Inferred best practice

**Acceptance criteria:**
- GET /pantry responds in under 300ms (p95)
- POST /pantry responds in under 400ms (p95)
- GET /recipes responds in under 500ms (p95)
- POST /auth/login responds in under 500ms (p95, accounting for bcrypt)

**Test cases:** TC-PERF-001

---

#### REQ-PERF-002

**Title:** API stability under concurrent load

**Description:** The API shall remain stable and return correct responses under concurrent load simulating multiple simultaneous users.

**Priority:** Medium

**Source:** Inferred from deployment intent

**Acceptance criteria:**
- System handles [TBD: target concurrent users] simultaneous requests without degradation
- Error rate remains below 1% under load
- No memory leaks or crashes observed during a [TBD: duration] load test

**Status:** TBD — define target load based on expected user base

**Test cases:** TC-PERF-002

---

### 4.2 Security

---

#### REQ-SEC-001

**Title:** Password storage

**Description:** User passwords shall never be stored in plain text.

**Priority:** High

**Source:** Inferred best practice / security requirement

**Acceptance criteria:**
- Passwords are hashed using bcrypt or equivalent with a minimum work factor of 10
- The hash is never returned in any API response
- The raw password is never logged

**Test cases:** TC-SEC-001

---

#### REQ-SEC-002

**Title:** JWT token security

**Description:** JWT tokens shall be signed, short-lived, and validated on every protected request.

**Priority:** High

**Source:** Inferred from implementation

**Acceptance criteria:**
- Tokens are signed with a secret not committed to version control
- Token expiry is set to [TBD: duration — e.g., 24 hours]
- Expired tokens are rejected with HTTP 401
- Tampered tokens (modified payload) are rejected with HTTP 401

**Test cases:** TC-SEC-002, TC-SEC-003

---

#### REQ-SEC-003

**Title:** User enumeration prevention

**Description:** The API shall not reveal whether a given email address exists in the system through differing error responses.

**Priority:** Medium

**Source:** Inferred from security best practice

**Acceptance criteria:**
- POST /auth/login returns the same HTTP status and message for wrong password and non-existent email
- POST /auth/register does not expose whether an email collision occurred via timing differences

**Test cases:** TC-SEC-004

---

### 4.3 Reliability

---

#### REQ-REL-001

**Title:** Graceful error handling

**Description:** The API shall return structured, consistent error responses for all failure cases rather than unhandled exceptions or stack traces.

**Priority:** High

**Source:** Inferred from implementation

**Acceptance criteria:**
- All 4xx and 5xx responses include a JSON body with at minimum `error` and `message` fields
- Stack traces are never exposed in production responses
- HTTP 500 is returned for unexpected server errors, not raw exception messages

**Test cases:** TC-REL-001, TC-REL-002

---

#### REQ-REL-002

**Title:** Input validation on all write endpoints

**Description:** All endpoints that accept a request body shall validate inputs and return structured validation errors.

**Priority:** High

**Source:** Inferred from implementation

**Acceptance criteria:**
- Missing required fields return HTTP 400 with field-level error details
- Invalid data types return HTTP 400
- Oversized inputs [TBD: define max lengths] return HTTP 400 or HTTP 413

**Test cases:** TC-REL-003

---

## 5. Constraints and future scope

### 5.1 Current constraints

| Constraint | Detail |
|---|---|
| Recipe database size | 8 recipes currently — limits recommendation test coverage. Expansion required. |
| Notification delivery | Email/push delivery not implemented. Notification state is API-only. |
| Single language | English only in this version |
| No pagination | GET /pantry returns all products with no pagination. May become a constraint at scale. |
| Single user per pantry | One pantry per account, no household/shared pantry support |

### 5.2 Known TBD items

The following items were identified during requirements archaeology and require a design decision before corresponding test cases can be finalised:

| ID | Area | Open question |
|---|---|---|
| TBD-001 | Auth | Minimum password complexity rules |
| TBD-002 | Auth | Server-side token invalidation on logout |
| TBD-003 | Pantry | Are past expiry dates accepted at write time? |
| TBD-004 | Notifications | Exact expiry window value and whether it is configurable |
| TBD-005 | Notifications | Are expired products included in notifications or excluded? |
| TBD-006 | Notifications | Stateful vs stateless notification tracking |
| TBD-007 | Recipes | Minimum ingredient match threshold |
| TBD-008 | Performance | Target concurrent user count for load tests |
| TBD-009 | Performance | JWT token expiry duration |
| TBD-010 | Reliability | Maximum input field lengths |

### 5.3 Future scope

- Email and push notification delivery
- Dietary and allergen filtering for recipe recommendations
- Household / shared pantry support
- Barcode scanning for product input
- Shopping list generation from recipe recommendations
- Pagination for pantry and recipe endpoints

---

## 6. Traceability matrix

This matrix links each requirement to its corresponding test cases. Update this table as test cases are written.

| Requirement ID | Title | Priority | Test cases | Status |
|---|---|---|---|---|
| REQ-AUTH-001 | User registration | High | TC-AUTH-001, TC-AUTH-002 | Not tested |
| REQ-AUTH-002 | Password complexity | High | TC-AUTH-003, TC-AUTH-004 | Not tested |
| REQ-AUTH-003 | Duplicate email rejection | High | TC-AUTH-005 | Not tested |
| REQ-AUTH-004 | Email format validation | High | TC-AUTH-006, TC-AUTH-007, TC-AUTH-008 | Not tested |
| REQ-AUTH-005 | Successful login | High | TC-AUTH-009, TC-AUTH-010 | Not tested |
| REQ-AUTH-006 | Login — wrong password | High | TC-AUTH-011 | Not tested |
| REQ-AUTH-007 | Login — non-existent email | High | TC-AUTH-012 | Not tested |
| REQ-AUTH-008 | Protected route enforcement | High | TC-AUTH-013, TC-AUTH-014, TC-AUTH-015 | Not tested |
| REQ-AUTH-009 | Logout | Medium | TC-AUTH-016 | Not tested |
| REQ-PAN-001 | Add product | High | TC-PAN-001, TC-PAN-002 | Not tested |
| REQ-PAN-002 | Missing required fields | High | TC-PAN-003, TC-PAN-004, TC-PAN-005 | Not tested |
| REQ-PAN-003 | Past expiry date | Medium | TC-PAN-006 | TBD |
| REQ-PAN-004 | Retrieve pantry | High | TC-PAN-007, TC-PAN-008, TC-PAN-009 | Not tested |
| REQ-PAN-005 | User data isolation | High | TC-PAN-010, TC-PAN-011, TC-PAN-012 | Not tested |
| REQ-PAN-006 | Update product | High | TC-PAN-013, TC-PAN-014, TC-PAN-015 | Not tested |
| REQ-PAN-007 | Delete product | High | TC-PAN-016, TC-PAN-017, TC-PAN-018 | Not tested |
| REQ-NOT-001 | Notification within expiry window | High | TC-NOT-001, TC-NOT-002, TC-NOT-003, TC-NOT-004 | Not tested |
| REQ-NOT-002 | Notification for today | High | TC-NOT-005 | Not tested |
| REQ-NOT-003 | Expired product handling | Medium | TC-NOT-006 | TBD |
| REQ-NOT-004 | No duplicate notifications | Medium | TC-NOT-007 | TBD |
| REQ-NOT-005 | Notification user-scoped | High | TC-NOT-008, TC-NOT-009 | Not tested |
| REQ-REC-001 | Recommendations by ingredients | High | TC-REC-001, TC-REC-002 | Not tested |
| REQ-REC-002 | Near-expiry prioritisation | High | TC-REC-003, TC-REC-004 | Not tested |
| REQ-REC-003 | Empty pantry | Medium | TC-REC-005 | Not tested |
| REQ-REC-004 | No matching recipes | Medium | TC-REC-006 | Not tested |
| REQ-REC-005 | Recipe result user-scoped | High | TC-REC-007 | Not tested |
| REQ-REC-006 | Recipe database size | Low | TC-REC-008 | TBD |
| REQ-PERF-001 | Response time | Medium | TC-PERF-001 | Not tested |
| REQ-PERF-002 | Concurrent load | Medium | TC-PERF-002 | TBD |
| REQ-SEC-001 | Password storage | High | TC-SEC-001 | Not tested |
| REQ-SEC-002 | JWT security | High | TC-SEC-002, TC-SEC-003 | Not tested |
| REQ-SEC-003 | User enumeration prevention | Medium | TC-SEC-004 | Not tested |
| REQ-REL-001 | Graceful error handling | High | TC-REL-001, TC-REL-002 | Not tested |
| REQ-REL-002 | Input validation | High | TC-REL-003 | Not tested |

---

*This document is version-controlled alongside the codebase. All changes should be committed with a descriptive message referencing the affected requirement IDs.*
