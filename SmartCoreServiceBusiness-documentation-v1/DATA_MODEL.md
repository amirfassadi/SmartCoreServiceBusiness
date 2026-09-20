# Data Model

## 1. Persistence Principle

Persist Service Business-owned state only.

Do not duplicate Identity's Person, credential, session, or organization internals.

## 2. Current Phase 1 Tables / Aggregates

The current Prisma schema persists only these Service Business-owned records:

- `Business`
- `BusinessProfile`
- `BusinessLocation`
- `ServiceCategory`
- `Service`
- `BusinessPolicy`

`organizationId` is an external Organization/Tenancy reference. No Organization, Person, User, Customer, Staff, Resource, Booking, Appointment, Payment, Finance, or Notification tables exist in the current schema.

Booking-related records below are architectural future boundaries, not current tables.

External references:

- person_id
- organization_id
- reservation_id
- payment_id

## 3. Current Aggregate Ownership

Each aggregate has one clear owner.

- `Business` is the root for its Phase 1-owned profile, locations, categories, services, and policies.
- `ServiceCategory` belongs to one Business and may be referenced by Services in that Business.
- `Service` belongs to one Business and requires a Business-owned ServiceCategory.
- `BusinessPolicy` is Business-scoped and versioned.
- `BusinessLocation` is Business-scoped and has an `active` field.

Future Booking/Appointment references to Person, Staff, Reservation, or Payment do not imply current database ownership.

## 4. Money

Never store ambiguous monetary values.

Use:

- integer minor units or a precise decimal strategy
- explicit currency
- snapshot at commercial commitment

Example:

```text
amount = 250000
currency = IRR
```

or the platform's canonical money type.

## 5. Time

Every business has an explicit timezone.

Persist timestamps in a canonical representation, normally UTC, while preserving business timezone for scheduling semantics.

## 6. Lifecycle and Soft Delete

- `Service.archivedAt` and `ServiceCategory.archivedAt` distinguish active (`null`) from archived (timestamp) resources.
- Archived Service and ServiceCategory records remain retrievable by ID and cannot be updated.
- Service archive and restore are idempotent. Service `deletedAt` remains independent and is not changed by archive/restore.
- ServiceCategory has no `deletedAt` field or delete operation.
- Business and Service retain nullable `deletedAt` fields in the current schema, but no delete API is implemented for this Phase 1 surface.
- `BusinessLocation.active` is a separate active/inactive lifecycle field and must not be conflated with Service/ServiceCategory archival.

Appointments and financial references must remain auditable.

## 7. Audit

Important mutations should produce audit records/events.

## 8. Concurrency

Use optimistic concurrency where appropriate.

Reservation conflicts require database-level/concurrency-safe protection.
