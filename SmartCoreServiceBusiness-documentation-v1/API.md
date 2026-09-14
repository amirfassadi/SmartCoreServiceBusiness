# API Contract

## 1. Principles

- versioned
- tenant-aware
- authenticated where required
- idempotent where retries matter
- stable error codes
- localized messages
- provider-neutral

## 2. Public Business

```http
GET /api/public/business/{slug}
GET /api/public/business/{slug}/services
GET /api/public/business/{slug}/staff
GET /api/public/business/{slug}/locations
GET /api/public/business/{slug}/availability
```

## 3. Appointment

```http
POST /api/public/business/{slug}/appointments
GET /api/public/appointments/{id}
POST /api/public/appointments/{id}/cancel
```

Exact endpoint naming may evolve with the platform API standard.

## 4. Authenticated Operations

Authenticated requests derive the person from the Identity session/token.

Example conceptual headers:

```http
Authorization: Bearer <token>
X-Business-Id: <business-id>
Accept-Language: fa-IR
Idempotency-Key: <unique-key>
```

The actual platform standard may replace these headers with a context/token mechanism.

## 5. Availability Request

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

## 6. Appointment Request

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

## 7. Error Contract

```json
{
  "code": "APPOINTMENT_SLOT_UNAVAILABLE",
  "message": "This time slot is no longer available.",
  "details": {}
}
```

Clients must use `code` for programmatic behavior.

## 8. HTTP Statuses

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
