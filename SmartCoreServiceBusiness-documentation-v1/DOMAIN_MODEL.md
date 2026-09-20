# Domain Model

## 1. Core Principle

Identity owns the person.

Service Business owns the person's relationship to a business.

## 2. Business

```text
Business
├── id
├── organization_id
├── slug
├── default_locale
├── supported_locales
├── timezone
├── currency
├── status
└── policies
```

`organization_id` references the owning organizational context; the implementation must use the Organization/Tenancy contract rather than duplicating ownership logic.

## 3. Current Phase 1 Domain Scope

The current implementation owns Business, BusinessProfile, BusinessLocation, ServiceCategory, Service, and BusinessPolicy. Customer, Staff, Appointment, Reservation, Payment, and Resource concepts below are architectural integration targets and are not current domain entities in this repository.

## 4. Customer Relationship (Future Boundary)

```text
BusinessCustomer
├── id
├── business_id
├── person_id
├── status
├── created_at
└── metadata
```

This is not the person's identity.

## 5. Staff Relationship (Future Boundary)

```text
BusinessStaff
├── id
├── business_id
├── person_id
├── status
├── staff_profile
└── capabilities
```

A staff member may also be a customer.

## 6. Manager / Owner (Future Identity/Authorization Boundary)

Manager and Owner are business relationships/capabilities, not global identity roles.

A person can be:

```text
Business A: Owner + Customer
Business B: Staff + Customer
```

## 7. Service

```text
Service
├── id
├── business_id
├── category_id
├── duration
├── archived_at
├── created_at
├── updated_at
└── deleted_at (independent nullable persistence field)
```

The current Prisma model contains name, slug, durationMinutes, archivedAt, and deletedAt. Price execution, booking policy, and translations are future integration concerns, not current Service fields. Active means `archivedAt = null`; archived means `archivedAt` has a timestamp.

## 8. Location

```text
Location
├── id
├── business_id
├── address
├── timezone
├── active
└── timestamps
```

The current Prisma model contains name, optional address, timezone, active, and timestamps. Coordinates and translations are future concerns.

## 9. Appointment (Future Boundary)

Appointment is the business representation of a service booking.

```text
Appointment
├── id
├── business_id
├── customer_person_id
├── service_id
├── staff_id?
├── location_id
├── reservation_id
├── status
├── price_snapshot
├── deposit_snapshot
├── locale
├── notes
├── created_at
└── timestamps
```

Scheduling/Reservation owns the actual time/resource reservation.

## 10. Appointment Lifecycle (Future Boundary)

```text
pending
├── awaiting_payment
│   ├── confirmed
│   └── cancelled
├── confirmed
│   ├── completed
│   ├── no_show
│   └── cancelled
└── rejected
```

State transitions must be explicit and auditable.

## 11. Snapshots (Future Booking Boundary)

Historical appointments must not change because a service later changes.

At booking time snapshot:

- price
- currency
- deposit requirement
- relevant service title/locale
- cancellation policy version where required

## 12. Current and Future Invariants

Current Phase 1 examples:

- Service belongs to exactly one Business.
- ServiceCategory belongs to exactly one Business.
- Service category must belong to the same Business as the Service.
- Category parent must belong to the same Business.
- A Category cannot be its own parent.
- Archived Services and Categories cannot be updated.
- A Category cannot be archived while it has active Services.

Future Booking examples:

- appointment belongs to exactly one business
- customer relationship belongs to the same business
- selected service belongs to the same business
- selected location belongs to the same business
- staff belongs to the same business when present
- reservation belongs to the appointment
- confirmed appointment has a valid reservation
- payment-required appointment cannot be confirmed without successful financial confirmation unless an explicit policy says otherwise

## 13. Relation as First-Class Concept

Where the broader SmartCore platform exposes a first-class Relation model, Service Business should consume it rather than creating competing global relationship semantics.
