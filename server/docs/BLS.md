# Business Logic Specification — FoodSaver

**Version:** 1.0.0
**Status:** Draft
**Last updated:** 2026-05-14
**Author:** Trish
**Related documents:** `docs/SRS.md`

---

## Purpose

This document captures the business rules, algorithms, boundary conditions, and edge cases that drive FoodSaver's core behaviour. Unlike the SRS, which defines *what* the system does, this document defines *why* and *how* — the logic that lives in the application layer and is not visible in API contracts or database schemas.

Every rule defined here maps directly to test cases. Rules marked `TBD` represent open design decisions that must be resolved before the corresponding test cases can be written.

---

## Table of contents

1. [Authentication rules](#1-authentication-rules)
2. [Pantry management rules](#2-pantry-management-rules)
3. [Expiry notification rules](#3-expiry-notification-rules)
4. [Recipe recommendation rules](#4-recipe-recommendation-rules)
5. [Data integrity rules](#5-data-integrity-rules)
6. [Security rules](#6-security-rules)
7. [Open decisions](#7-open-decisions)

---

## 1. Authentication rules

### 1.1 Registration

**BL-AUTH-001 — Email uniqueness**

The system enforces globally unique email addresses. Uniqueness is checked case-insensitively at registration time. An attempt to register with an email that already exists — regardless of case — is rejected.

```
"user@example.com" and "User@Example.com" are treated as the same address.
```

**BL-AUTH-002 — Password minimum length**

Passwords must be at least 6 characters long. Passwords shorter than 6 characters are rejected at registration time. This rule is enforced server-side regardless of any client-side validation.

**BL-AUTH-003 — Password complexity**

In addition to minimum length, passwords must satisfy all three of the following rules:

| Rule | Description |
|---|---|
| Uppercase | At least one uppercase letter (A–Z) |
| Numeric | At least one digit (0–9) |
| Special character | At least one special character (e.g. `!@#$%^&*`) |

A password that fails any single rule is rejected. The error response must identify which rule was violated.

Boundary cases:
- `"Abc1!"` — 5 chars, fails length → rejected
- `"Abcd1!"` — 6 chars, all rules met → accepted
- `"abcd1!"` — no uppercase → rejected
- `"Abcdef!"` — no digit → rejected
- `"Abcdef1"` — no special character → rejected

**BL-AUTH-004 — Password storage**

Passwords are hashed using bcrypt with a minimum work factor of 10 before persistence. The raw password is never logged, returned in responses, or stored in plain text.

**BL-AUTH-005 — Pantry initialisation on registration**

When a new user account is created successfully, the system automatically creates an empty pantry record associated with that user. This happens atomically within the same transaction as user creation. A user account without an associated pantry is an invalid system state.

### 1.2 Login

**BL-AUTH-006 — Credential validation**

Login requires an exact match of email (case-insensitive) and password (case-sensitive, validated against stored hash). If either credential is incorrect, the system returns the same error response regardless of which credential failed — this prevents user enumeration.

```
Wrong password   → HTTP 401, generic message
Non-existent email → HTTP 401, same generic message
```

**BL-AUTH-007 — JWT issuance**

On successful login, the system issues a signed JWT containing:

| Claim | Value |
|---|---|
| `sub` | User ID |
| `email` | User email address |
| `iat` | Issued-at timestamp (Unix) |
| `exp` | Expiry timestamp — 24 hours after `iat` |

The token is signed with a server-side secret that is never exposed in API responses, logs, or version control.

**BL-AUTH-008 — Token expiry**

JWT tokens expire exactly 24 hours after issuance. An expired token is treated identically to a missing or malformed token — HTTP 401 is returned, with no information about whether the token was once valid.

### 1.3 Logout

**BL-AUTH-009 — Logout strategy**

`Status: TBD` — see [section 7.1](#71-logout-strategy). Until resolved, logout behaviour is not testable for server-side invalidation. Client-side token discard is assumed as the current implementation.

### 1.4 Protected routes

**BL-AUTH-010 — Authentication enforcement**

All endpoints except `POST /auth/register` and `POST /auth/login` require a valid JWT in the `Authorization: Bearer <token>` header. Requests with a missing, malformed, or expired token are rejected with HTTP 401 before any business logic executes.

**BL-AUTH-011 — User identity from token**

The authenticated user's identity is derived exclusively from the JWT payload. The system never accepts a user ID as a request parameter for operations scoped to the current user — the token is the sole source of truth for identity.

---

## 2. Pantry management rules

### 2.1 Product creation

**BL-PAN-001 — Required fields**

A product requires the following fields at creation time:

| Field | Type | Rule |
|---|---|---|
| `name` | string | Required, non-empty, max 100 chars |
| `quantity` | number | Required, greater than 0 |
| `unit` | string | Required (e.g. "kg", "units", "litres") |
| `expiryDate` | date | Required, ISO 8601 (YYYY-MM-DD), see BL-PAN-002 |

A request missing any required field returns HTTP 400 with a field-level error identifying the missing field. Multiple missing fields return all errors simultaneously, not just the first.

**BL-PAN-002 — Expiry date validation**

Expiry date rules at write time:

| Date value | Accepted? | Reason |
|---|---|---|
| Future date | ✓ Yes | Standard case |
| Today's date | ✓ Yes | Product expires today — still valid to track |
| Yesterday or earlier | ✗ No | Already expired — rejected at write time |

The comparison is made against the current date in UTC, using calendar day precision (not timestamp precision). A product with `expiryDate = today` at 23:59 UTC is accepted; a product with `expiryDate = yesterday` at 00:01 UTC is rejected.

**BL-PAN-003 — Ownership assignment**

A product is always associated with the authenticated user's pantry at creation time. The `userId` is derived from the JWT, never from the request body. A user cannot create a product in another user's pantry.

### 2.2 Product retrieval

**BL-PAN-004 — User data isolation**

`GET /pantry` returns only products belonging to the authenticated user. The query is always scoped by `userId` derived from the JWT. It is not possible for a user to retrieve another user's products through any parameter manipulation.

**BL-PAN-005 — Empty pantry response**

When a user's pantry contains no products, `GET /pantry` returns HTTP 200 with an empty array `[]`. HTTP 404 is never returned for an empty pantry.

### 2.3 Product update and deletion

**BL-PAN-006 — Ownership enforcement on mutation**

Before executing any update or delete operation, the system verifies that the target product belongs to the authenticated user. If the product exists but belongs to a different user, the system returns HTTP 404 — not HTTP 403 — to avoid confirming the existence of another user's data.

```
Product not found (any user)    → HTTP 404
Product found, wrong owner      → HTTP 404 (ownership concealed)
Product found, correct owner    → operation proceeds
```

**BL-PAN-007 — Partial updates**

`PUT /pantry/:id` accepts partial payloads. Only fields present in the request body are updated. Fields omitted from the request retain their existing values. An empty request body with no fields is accepted but results in no changes (HTTP 200 returned with unchanged product).

---

## 3. Expiry notification rules

### 3.1 Notification window

**BL-NOT-001 — 7-day calendar window**

A product enters the notification window when the number of calendar days between today (UTC) and the product's `expiryDate` is less than or equal to 7.

```
daysUntilExpiry = expiryDate (date only) - today (date only)

daysUntilExpiry <= 7  → product is in notification window
daysUntilExpiry >  7  → product is not in notification window
```

Calculation uses calendar days, not 24-hour periods. The comparison is date-only — time of day does not affect the result.

Boundary value analysis:

| Expiry date | Days until expiry | In window? |
|---|---|---|
| Today | 0 | ✓ Yes |
| Tomorrow | 1 | ✓ Yes |
| Today + 6 | 6 | ✓ Yes |
| Today + 7 | 7 | ✓ Yes — boundary, included |
| Today + 8 | 8 | ✗ No — boundary, excluded |
| Yesterday | -1 | ✓ Yes — expired, included with EXPIRED status |

**BL-NOT-002 — Expired product inclusion**

Products whose `expiryDate` is in the past (yesterday or earlier) are included in the notification response with a status of `EXPIRED`. They are not excluded or handled by a separate endpoint.

The notification response distinguishes between near-expiry and expired products via a `status` field:

| Condition | Status value |
|---|---|
| `daysUntilExpiry` between 1 and 7 | `EXPIRING_SOON` |
| `daysUntilExpiry` = 0 (today) | `EXPIRING_TODAY` |
| `daysUntilExpiry` < 0 (past) | `EXPIRED` |

### 3.2 Notification state

**BL-NOT-003 — Stateful persistence**

Notification records are persisted in the database. When `GET /notifications` is called, the system:

1. Computes the current notification window from the user's pantry
2. Creates new notification records for products newly entering the window
3. Returns all current notification records for the user

The notification record stores at minimum: `productId`, `userId`, `status`, `createdAt`.

**BL-NOT-004 — No deduplication needed by design**

Because notifications are persisted and reflect current pantry state, and because there is no read/unread tracking, duplicate notification records for the same product are prevented by checking for an existing record before inserting. A product that remains in the notification window across multiple `GET /notifications` calls does not generate duplicate records.

**BL-NOT-005 — Notification removal**

When a product leaves the notification window (e.g. it is deleted from the pantry, or its expiry date is updated to a future date beyond 7 days), its notification record is removed or marked inactive. The next call to `GET /notifications` reflects the updated state.

`Status: TBD` — confirm whether stale notification records are deleted hard or soft.

**BL-NOT-006 — User scoping**

Notifications are always scoped to the authenticated user. A user's `GET /notifications` response never contains notifications from another user's pantry. When a user has no products in the notification window, the response is HTTP 200 with an empty array.

### 3.3 Trigger mechanism

**BL-NOT-007 — On-demand computation**

Notifications are computed when the user calls `GET /notifications`. There is no background cron job. The freshness of notifications is therefore dependent on the user making a request — notifications are not pushed.

---

## 4. Recipe recommendation rules

### 4.1 Match algorithm

**BL-REC-001 — Minimum match threshold**

A recipe is eligible for recommendation if at least 1 of its required ingredients is present in the user's pantry. There is no minimum percentage threshold — a single matching ingredient is sufficient.

**BL-REC-002 — Partial name matching**

Ingredient matching uses case-insensitive partial string matching. A pantry product matches a recipe ingredient if either string contains the other as a substring.

```
Pantry: "cherry tomato"   Recipe ingredient: "tomato"       → MATCH
Pantry: "tomato"          Recipe ingredient: "cherry tomato" → MATCH
Pantry: "tomato sauce"    Recipe ingredient: "tomato"        → MATCH
Pantry: "potato"          Recipe ingredient: "tomato"        → NO MATCH
```

Matching is performed on the ingredient name field only — quantity and unit are not considered.

**BL-REC-003 — Match score calculation**

Each recommended recipe receives a `matchScore` representing the proportion of its required ingredients found in the user's pantry:

```
matchScore = matchedIngredients / totalRecipeIngredients

Example: recipe has 5 ingredients, user has 3 → matchScore = 0.6
```

The score is a float between 0 (exclusive, since at least 1 match is required) and 1.0 (inclusive, all ingredients present).

**BL-REC-004 — Result ordering**

Recipes are returned ordered by `matchScore` descending. Recipes with equal `matchScore` are returned in an unspecified order (no secondary sort defined).

```
matchScore: 1.0  → first
matchScore: 0.75 → second
matchScore: 0.5  → third
```

Near-expiry status of pantry ingredients does not affect ranking. All recommendations are sorted by match percentage only.

### 4.2 Edge cases

**BL-REC-005 — Empty pantry**

When a user's pantry contains no products, `GET /recipes` returns HTTP 200 with an empty array. No recommendations are possible with zero pantry items.

**BL-REC-006 — No matching recipes**

When the user's pantry contains products but none match any recipe ingredient, `GET /recipes` returns HTTP 200 with an empty array. This is not an error condition.

**BL-REC-007 — Recipe database minimum coverage**

The recipe database must contain sufficient variety to produce meaningful test coverage of the recommendation algorithm. The current database of 8 recipes is insufficient. A minimum of 30 recipes with varied ingredient sets is required, including:

- At least 5 recipes sharing overlapping ingredients (to test ranking logic)
- At least 3 recipes with a single ingredient (to test minimum threshold boundary)
- At least 3 recipes with 10+ ingredients (to test low match scores)

**BL-REC-008 — User scoping**

Recipe recommendations are computed from the authenticated user's pantry only. Two users with different pantry contents receive different recommendations from the same recipe database.

---

## 5. Data integrity rules

### 5.1 Referential integrity

**BL-INT-001 — User to pantry relationship**

Each user has exactly one pantry. The relationship is 1:1 and is created atomically on user registration (see BL-AUTH-005). There is no API endpoint to create or delete a pantry independently.

**BL-INT-002 — Pantry to product relationship**

A product must always belong to a valid pantry. Orphaned product records (products with no associated pantry or user) are an invalid system state. The database enforces this via foreign key constraint.

**BL-INT-003 — Account deletion cascade**

`Status: TBD` — see [section 7.2](#72-account-deletion-strategy). Account deletion is not currently implemented. When implemented, the cascade behaviour (delete products, delete pantry, delete notifications) must be explicitly defined and enforced at the database level, not application level only.

**BL-INT-004 — Notification to product relationship**

A notification record must reference a valid product. If a product is deleted from the pantry, its associated notification records must also be removed. This prevents stale notifications for non-existent products.

### 5.2 Response schema consistency

**BL-INT-005 — No password exposure**

The `password` or any hashed credential field must never appear in any API response, regardless of endpoint, HTTP method, or error condition. This includes registration success responses, user profile responses, and error responses.

**BL-INT-006 — Consistent error shape**

All error responses across all endpoints must conform to a consistent JSON structure:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description",
  "field": "fieldName"  // optional, for validation errors
}
```

A response that returns a plain string, an HTML error page, or an unhandled exception stack trace is a defect regardless of the HTTP status code.

**BL-INT-007 — No stack trace exposure**

Stack traces, file paths, and internal error details must never appear in API responses in any environment accessible to end users. Production error responses for HTTP 500 return a generic message only.

---

## 6. Security rules

### 6.1 Input validation

**BL-SEC-001 — Server-side validation is canonical**

All input validation is enforced server-side. Client-side validation (if present in the React frontend) is a UX convenience only. The API must reject invalid inputs independently of whether the frontend validates them.

**BL-SEC-002 — Maximum field lengths**

To prevent oversized payloads, the following maximum lengths apply:

| Field | Max length |
|---|---|
| `email` | 254 characters (RFC 5321) |
| `password` | 128 characters |
| `product.name` | 100 characters |
| `product.unit` | 50 characters |

Requests exceeding these limits return HTTP 400 or HTTP 413 depending on whether the limit is field-level or payload-level.

### 6.2 Access control

**BL-SEC-003 — User enumeration prevention**

The login endpoint returns the same HTTP status code and response body for both wrong password and non-existent email scenarios. Response timing must not reveal which case applies — bcrypt comparison is always performed (against a dummy hash if the user does not exist) to prevent timing-based enumeration.

**BL-SEC-004 — Ownership concealment**

When a user attempts to access a resource belonging to another user, the system returns HTTP 404 rather than HTTP 403. Returning HTTP 403 would confirm that the resource exists, which leaks information about other users' data.

---

## 7. Open decisions

These items were identified during requirements archaeology. Each must be resolved before the corresponding test cases can be written. The decision owner should update this document and the SRS traceability matrix when resolved.

### 7.1 Logout strategy

**Decision required:** Does the server maintain a token blacklist, or is logout client-side only?

| Option | Implication |
|---|---|
| Client-side only | Simpler — no server state. Token remains valid until natural expiry (24h). Cannot be tested for server-side invalidation. |
| Server-side blacklist | More secure. Requires a token store (Redis or DB table). Testable: blacklisted token must be rejected immediately. |

**Impact on tests:** If client-side only, TC-AUTH-016 tests only that the logout endpoint returns HTTP 200. If server-side, TC-AUTH-016 also verifies that the token is rejected on subsequent requests.

### 7.2 Account deletion strategy

**Decision required:** Is account deletion implemented? If so, what is the cascade behaviour?

| Option | Implication |
|---|---|
| Not implemented | No endpoint, no tests required |
| Cascade delete | User deleted → pantry, products, notifications all hard-deleted |
| Soft delete | User marked inactive, data retained for recovery |
| Restricted | Cannot delete account while pantry has products |

**Impact on tests:** Determines whether data integrity tests for cascade behaviour are in scope.

### 7.3 Deployment scale

**Decision required:** What is the target concurrent user count for load testing?

Without this, `REQ-PERF-002` and `TC-PERF-002` cannot be written with meaningful thresholds. A reasonable starting assumption for a small personal deployment is 10–20 concurrent users. Confirm before load tests are designed.

### 7.4 Stale notification cleanup

**Decision required:** When a product leaves the notification window, are its notification records hard-deleted or soft-deleted (marked inactive)?

**Impact on tests:** Determines whether TC-NOT-007 asserts absence of a record or presence of a record with an inactive flag.

---

*This document is version-controlled alongside the codebase. When an open decision is resolved, update the relevant section, remove it from section 7, and update the corresponding `TBD` items in `docs/SRS.md`.*
