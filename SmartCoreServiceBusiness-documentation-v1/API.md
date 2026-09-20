# API Contract

## 1. Principles

- versioned
- tenant-aware
- authenticated where required
- idempotent where retries matter
- stable error codes
- localized messages
- provider-neutral

## 2. Implemented Phase 1 API

The following authenticated-style routes are implemented by the current `BusinessController`. They require an external organization/business context; local development tests use the dedicated test-context middleware and headers, which are not production authentication.

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
