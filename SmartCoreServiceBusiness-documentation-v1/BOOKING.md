# Booking and Reservation

## Status in this repository

Booking, Appointment, Availability, Reservation, Staff, Resource, Payment, and Notification are not implemented production bounded contexts in the current repository. This document defines the intended integration contract for later phases. The current Phase 1 implementation provides Business, ServiceCategory, Service, BusinessLocation, and BusinessPolicy references only.

## 1. Ownership

Service Business owns the **business booking intent**.

Scheduling/Reservation owns:

- time slots
- availability mechanics
- reservations
- conflicts
- resource allocation

## 2. Availability Hierarchy

Availability may depend on:

1. business hours
2. location hours
3. staff hours
4. overrides
5. blocked time
6. existing reservations
7. service duration
8. resource constraints
9. booking policies

## 3. Appointment Creation

Conceptual flow:

```text
Customer
  ↓
Select Service
  ↓
Select Location
  ↓
Select Staff (optional)
  ↓
Request Availability
  ↓
Reserve Time/Resources
  ↓
Create Appointment
  ↓
Payment if required
  ↓
Confirm
```

## 4. Staff

`staff_id` may be null when the customer has no staff preference.

The reservation system may later allocate an eligible staff member.

## 5. Resource

A service may require:

- staff
- room
- chair
- equipment
- vehicle
- treatment area
- other resources

The generic model must not assume one resource type.

## 6. Overlap Prevention

Database-level overlap protection is preferred where supported.

For PostgreSQL, time-range/exclusion constraints are a strong option.

Application checks remain useful but must not be the only concurrency protection.

## 7. Appointment States

```text
pending
awaiting_payment
confirmed
cancelled
completed
no_show
rejected
```

Invalid state transitions must be rejected.

## 8. Deposit

If policy requires a deposit:

```text
Appointment
   ↓
Deposit Required
   ↓
Finance Payment
   ↓
Successful
   ↓
Confirmed
```

Deposit amount must be snapshotted.

## 9. Cancellation

Cancellation policy belongs to Service Business.

Financial consequences are executed through Finance.

Communication of cancellation is handled asynchronously.

## 10. Idempotency

Appointment creation and payment initiation should support idempotency keys where retries are possible.

## 11. Guest Booking

Guest booking may be supported later.

Authenticated booking is preferred for the initial architecture.
