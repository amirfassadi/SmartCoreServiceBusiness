# API Contract

## 1. Principles

- versioned
- tenant-aware
- authenticated where required
- idempotent where retries matter
- stable error codes
- localized messages
- provider-neutral

## 1.1 Current API audience and stabilization status

The implemented `/api/v1/businesses/...` routes are the current management/Operator API surface for the Phase 1 backend. They are not public customer-facing routes. Public customer APIs remain deferred and are intentionally not implemented.

The API is versioned by the `/api/v1` prefix. There is no local authentication or authorization engine. Production requests are expected to arrive through an external validated Identity/Authorization boundary. Local development and integration tests may use test headers; those headers are not production authentication.

OpenAPI generation is not yet configured. The current controller, DTOs, response mappers, error filter, and this endpoint contract are the inputs for a later OpenAPI step.

## 2. Implemented Phase 1 API

The following authenticated-style routes are implemented by the current `BusinessController`. They require an external organization/business context; local development tests use the dedicated test-context middleware and headers, which are not production authentication.

### Frontend contract boundary

The Frontend consumes the HTTP API contract only. It must not import backend Domain entities, Application use cases, repository ports, or Prisma models. The intended future dependency chain is:

```text
Backend Domain -> Application -> HTTP API -> OpenAPI Contract -> Generated TypeScript API Client -> Frontend
```

No OpenAPI document or generated TypeScript API client currently exists in this repository. OpenAPI definition and client generation are future API-stabilization steps.

## 2.1 Request context contract

| Field | Source | Required | Current propagation | Trust boundary |
|---|---|---:|---|---|
| `organizationId` | External validated context; local tests use `x-smartcore-test-organization-id` | Yes | Middleware -> controller adapter -> `BusinessContext` -> repositories | Must be supplied by upstream Identity/Organization integration in production |
| `businessId` | Versioned route parameter | Yes for Business-owned routes | Controller -> `BusinessContext` -> application -> repository scope | Route value is not sufficient by itself; Business and Organization scope are checked |
| `actorId` | External context; local tests use `x-smartcore-test-actor-id` | No | Middleware -> `BusinessContext` | No local authorization decision currently consumes it |
| `capabilities` | External context; local tests may use `x-smartcore-test-capabilities` | No | Middleware -> `BusinessContext` | Contract placeholder only; no local authorization engine evaluates it |

Missing context produces `BUSINESS_ACCESS_DENIED` with HTTP 403. The Frontend must not treat these development headers as an authentication mechanism.

### Business

```http
POST /api/v1/businesses
GET /api/v1/businesses/{businessId}
PATCH /api/v1/businesses/{businessId}/profile
```

### BusinessLocation

```http
POST /api/v1/businesses/{businessId}/locations
GET /api/v1/businesses/{businessId}/locations
PATCH /api/v1/businesses/{businessId}/locations/{locationId}
POST /api/v1/businesses/{businessId}/locations/{locationId}/deactivate
```

### ServiceCategory

```http
POST /api/v1/businesses/{businessId}/service-categories
GET /api/v1/businesses/{businessId}/service-categories?status=active|archived|all
GET /api/v1/businesses/{businessId}/service-categories/{categoryId}
PATCH /api/v1/businesses/{businessId}/service-categories/{categoryId}
POST /api/v1/businesses/{businessId}/service-categories/{categoryId}/archive
POST /api/v1/businesses/{businessId}/service-categories/{categoryId}/restore
```

### Service

```http
POST /api/v1/businesses/{businessId}/services
GET /api/v1/businesses/{businessId}/services?status=active|archived|all
GET /api/v1/businesses/{businessId}/services/{serviceId}
PATCH /api/v1/businesses/{businessId}/services/{serviceId}
POST /api/v1/businesses/{businessId}/services/{serviceId}/archive
POST /api/v1/businesses/{businessId}/services/{serviceId}/restore
```

### BusinessPolicy

```http
POST /api/v1/businesses/{businessId}/policies
GET /api/v1/businesses/{businessId}/policies/{policyKey}
GET /api/v1/businesses/{businessId}/policies/{policyKey}/versions
PUT /api/v1/businesses/{businessId}/policies/{policyKey}
```

Request DTOs, validation, response mappers, and exact lifecycle/error behavior are implemented in `src/presentation/http` and covered by the unit/integration tests.

### Implemented response and status behavior

- Create operations return HTTP 201.
- Successful reads and updates return HTTP 200.
- Deactivate/archive/restore action routes return HTTP 201 in the current controller.
- Validation errors return HTTP 400 with `{ code, message, details }`.
- Business access denial returns HTTP 403.
- Missing scoped resources return HTTP 404.
- Lifecycle and uniqueness conflicts return HTTP 409.
- Invalid parent/category references return HTTP 422.
- Unexpected unhandled failures use the generic `PERSISTENCE_FAILURE` HTTP 500 fallback.

Implemented lifecycle and scope error codes include `BUSINESS_ACCESS_DENIED`, `BUSINESS_NOT_FOUND`, `BUSINESS_ARCHIVED`, `LOCATION_NOT_FOUND`, `CATEGORY_NOT_FOUND`, `SERVICE_NOT_FOUND`, `SERVICE_ARCHIVED`, `CATEGORY_ARCHIVED`, `CATEGORY_HAS_ACTIVE_SERVICES`, `INVALID_PARENT_CATEGORY`, `INVALID_SERVICE_CATEGORY`, and `POLICY_VERSION_CONFLICT`. `CROSS_BUSINESS_REFERENCE` is defined and mapped for the stable contract, while current repository paths commonly return more specific scoped-resource or invalid-reference codes.

## 2.2 Endpoint error matrix

The following matrix describes the current emitted error families. Every endpoint may additionally return `VALIDATION_ERROR` (400), `PERSISTENCE_FAILURE` (500), or `BUSINESS_ACCESS_DENIED` (403) when the relevant context/scope condition applies.

| Endpoint family | Success | Resource errors | Conflict/lifecycle errors | Domain validation |
|---|---:|---|---|---|
| Business create | 201 | `BUSINESS_NOT_FOUND` is not used for creation | `BUSINESS_SLUG_ALREADY_EXISTS` (409) | `VALIDATION_ERROR` (400) |
| Business get/profile | 200 | `BUSINESS_NOT_FOUND`, `PROFILE_NOT_FOUND` (404) | `BUSINESS_ARCHIVED` applies to active operations where required | `VALIDATION_ERROR` (400) |
| Location create/update/list/deactivate | 201/200 | `BUSINESS_NOT_FOUND`, `LOCATION_NOT_FOUND` (404) | `LOCATION_NAME_ALREADY_EXISTS`, `BUSINESS_ARCHIVED` (409) | `VALIDATION_ERROR` (400) |
| Category create/update/get/list | 201/200 | `BUSINESS_NOT_FOUND`, `CATEGORY_NOT_FOUND` (404) | `CATEGORY_SLUG_ALREADY_EXISTS`, `CATEGORY_ARCHIVED` (409) | `INVALID_PARENT_CATEGORY` (422), `VALIDATION_ERROR` (400) |
| Category archive/restore | 201 | `CATEGORY_NOT_FOUND` (404) | `CATEGORY_HAS_ACTIVE_SERVICES`, `CATEGORY_ARCHIVED` (409 where applicable) | `VALIDATION_ERROR` (400) |
| Service create/update/get/list | 201/200 | `BUSINESS_NOT_FOUND`, `SERVICE_NOT_FOUND` (404) | `SERVICE_SLUG_ALREADY_EXISTS`, `SERVICE_ARCHIVED`, `BUSINESS_ARCHIVED` (409) | `INVALID_SERVICE_CATEGORY` (422), `VALIDATION_ERROR` (400) |
| Service archive/restore | 201 | `SERVICE_NOT_FOUND` (404) | `CATEGORY_ARCHIVED` (409 on restore) | `INVALID_SERVICE_CATEGORY` (422), `VALIDATION_ERROR` (400) |
| Policy create/get/list/update | 201/200 | `BUSINESS_NOT_FOUND`, `POLICY_NOT_FOUND` (404) | `POLICY_KEY_ALREADY_EXISTS`, `POLICY_VERSION_CONFLICT`, `BUSINESS_ARCHIVED` (409) | `INVALID_POLICY`, `VALIDATION_ERROR` (400) |

`CROSS_BUSINESS_REFERENCE` remains a defined stable code mapped to 403, but current paths generally emit more specific resource/reference codes.

## 3. Planned / Deferred Public API

The following routes are conceptual architecture targets only. They are not implemented by the current controller:

```http
GET /api/public/business/{slug}
GET /api/public/business/{slug}/services
GET /api/public/business/{slug}/staff
GET /api/public/business/{slug}/locations
GET /api/public/business/{slug}/availability
```

## 4. Planned Appointment API

```http
POST /api/public/business/{slug}/appointments
GET /api/public/appointments/{id}
POST /api/public/appointments/{id}/cancel
```

Exact endpoint naming may evolve with the platform API standard.

## 5. External Authentication Context

Authenticated requests derive the person from the Identity session/token.

Example conceptual headers:

```http
Authorization: Bearer <token>
X-Business-Id: <business-id>
Accept-Language: fa-IR
Idempotency-Key: <unique-key>
```

The actual platform standard may replace these headers with a context/token mechanism.

## 5.1 Implemented Service and Category Lifecycle

Service and ServiceCategory use `archivedAt` as their lifecycle marker:

- `archivedAt: null` means `ACTIVE`.
- `archivedAt` with a timestamp means `ARCHIVED`.

Archived Services and Categories remain retrievable by ID, but cannot be updated. Archive and restore operations are idempotent. A category cannot be archived while it contains an active Service.

Service and category list endpoints support an optional `status` query parameter:

```http
GET /api/v1/businesses/{businessId}/services?status=active
GET /api/v1/businesses/{businessId}/services?status=archived
GET /api/v1/businesses/{businessId}/services?status=all
GET /api/v1/businesses/{businessId}/service-categories?status=active
GET /api/v1/businesses/{businessId}/service-categories?status=archived
GET /api/v1/businesses/{businessId}/service-categories?status=all
```

The default is `status=active`. Invalid status values are rejected as validation errors.

## 5.2 Idempotency and concurrency

- Service archive and restore are idempotent.
- ServiceCategory archive and restore are idempotent.
- Location deactivate has no explicit HTTP idempotency-key contract; repeated behavior is not separately specified.
- Create and ordinary update operations do not support `Idempotency-Key`.
- BusinessPolicy is the only current optimistic-concurrency contract. Versions start at 1, updates append the next version, and stale expected versions return `POLICY_VERSION_CONFLICT` (409).
- Service, ServiceCategory, Location, Business, and BusinessProfile do not expose version fields.

## 5.3 Collection contract

Current collection endpoints have no pagination, cursor, offset, search, or client-controlled sorting. Service and ServiceCategory support only the documented `status` filter and default to active records. Repository ordering is by `name ASC` for Locations, Services, and Categories and by ascending `version` for Policy versions.

## 5.4 Runtime/browser boundary

- Port is configured by `PORT`, defaulting to 3000.
- Environment variables are loaded through `dotenv/config`.
- CORS is opt-in through comma-separated `CORS_ALLOWED_ORIGINS`; no production origin is hard-coded.
- No API base URL, reverse-proxy, or authentication provider configuration is implemented in this repository.
- `@nestjs/swagger` is installed, but Swagger/OpenAPI bootstrap and document generation are not currently configured.

## 6. Conceptual Availability Request

Conceptual input:

```json
{
  "service_id": "...",
  "location_id": "...",
  "staff_id": null,
  "from": "2026-09-15T09:00:00+03:30",
  "to": "2026-09-15T18:00:00+03:30"
}
```

## 7. Conceptual Appointment Request

```json
{
  "service_id": "...",
  "location_id": "...",
  "staff_id": null,
  "start": "2026-09-15T14:00:00+03:30",
  "locale": "fa-IR"
}
```

Customer identity is derived from authentication.

## 8. Error Contract

```json
{
  "code": "APPOINTMENT_SLOT_UNAVAILABLE",
  "message": "This time slot is no longer available.",
  "details": {}
}
```

Clients must use `code` for programmatic behavior.

## 9. HTTP Statuses

Typical:

- 400 invalid request
- 401 unauthenticated
- 403 unauthorized
- 404 not found
- 409 conflict
- 422 domain validation
- 429 rate limited
- 500 internal failure
- 503 dependency unavailable

## 9. API Versioning

Breaking changes require an explicit versioning strategy agreed with the SmartCore platform.
