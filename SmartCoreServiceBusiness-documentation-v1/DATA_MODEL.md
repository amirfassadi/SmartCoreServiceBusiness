# Data Model

## 1. Persistence Principle

Persist Service Business-owned state only.

Do not duplicate Identity's Person, credential, session, or organization internals.

## 2. Main Tables / Aggregates

Potential aggregate roots:

- businesses
- business_customers
- business_staff
- service_categories
- services
- locations
- appointments
- business_policies

External references:

- person_id
- organization_id
- reservation_id
- payment_id

## 3. Aggregate Ownership

Each aggregate has one clear owner.

Example:

```text
Appointment
  ├── service reference
  ├── customer person reference
  ├── staff reference
  ├── reservation reference
  └── payment reference
```

These references do not imply database-level ownership of external aggregates.

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

## 6. Soft Delete

Use soft deletion only where business history requires it.

Appointments and financial references must remain auditable.

## 7. Audit

Important mutations should produce audit records/events.

## 8. Concurrency

Use optimistic concurrency where appropriate.

Reservation conflicts require database-level/concurrency-safe protection.
