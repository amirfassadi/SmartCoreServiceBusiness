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

## 3. Customer Relationship

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

## 4. Staff Relationship

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

## 5. Manager / Owner

Manager and Owner are business relationships/capabilities, not global identity roles.

A person can be:

```text
Business A: Owner + Customer
Business B: Staff + Customer
```

## 6. Service

```text
Service
├── id
├── business_id
├── category_id
├── duration
├── price_reference
├── active
├── booking_policy
└── translations
```

Price execution belongs to Pricing/Finance contracts. Appointment snapshots preserve the effective commercial terms.

## 7. Location

```text
Location
├── id
├── business_id
├── address
├── coordinates
├── timezone
├── active
└── translations
```

## 8. Appointment

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

## 9. Appointment Lifecycle

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

## 10. Snapshots

Historical appointments must not change because a service later changes.

At booking time snapshot:

- price
- currency
- deposit requirement
- relevant service title/locale
- cancellation policy version where required

## 11. Invariants

Examples:

- appointment belongs to exactly one business
- customer relationship belongs to the same business
- selected service belongs to the same business
- selected location belongs to the same business
- staff belongs to the same business when present
- reservation belongs to the appointment
- confirmed appointment has a valid reservation
- payment-required appointment cannot be confirmed without successful financial confirmation unless an explicit policy says otherwise

## 12. Relation as First-Class Concept

Where the broader SmartCore platform exposes a first-class Relation model, Service Business should consume it rather than creating competing global relationship semantics.
