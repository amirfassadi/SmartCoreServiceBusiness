# Architecture

## 1. Position

Service Business is a domain application in the SmartCore ecosystem.

```text
                    SmartCore Ecosystem
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
     Identity          Organization        Authorization
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                  ┌─────────────────┐
                  │ Service Business│
                  └───────┬─────────┘
                          │
       ┌──────────┬───────┼────────┬───────────┐
       ▼          ▼       ▼        ▼           ▼
 Scheduling   Resource  Finance  Communication Workflow
 Reservation            Payment  Notification
```

## 2. Layers

### Presentation

- Public API
- Authenticated API
- Administrative API
- Web/mobile clients

### Application

Coordinates use cases and contracts.

### Domain

Contains Service Business rules and invariants.

### Integration

Adapters for external modules/platforms.

### Infrastructure

Database, cache, queues, HTTP clients, object storage adapters, configuration.

## 3. Dependency Direction

```text
Presentation
    ↓
Application
    ↓
Domain
    ↓
Contracts
    ↓
Adapters
    ↓
Infrastructure
```

Domain code must not directly depend on provider SDKs.

## 4. Module Interaction

Modules communicate through:

- API contracts
- commands
- domain events
- integration events

No direct implementation dependency.

## 5. Synchronous vs Asynchronous

Use synchronous calls when the caller needs an immediate decision.

Examples:

- get business profile
- check availability
- create reservation
- create payment session

Use asynchronous events for side effects.

Examples:

- send confirmation
- send reminder
- update search index
- analytics
- referral processing

## 6. Transaction Boundary

Service Business transaction should contain only Service Business-owned state.

Cross-module operations use orchestration/sagas/events rather than distributed database transactions.

Example:

```text
Create Appointment
      ↓
Appointment Pending
      ↓
Payment Session
      ↓
Payment Succeeded
      ↓
Appointment Confirmed
      ↓
AppointmentConfirmed event
      ├── Notification
      ├── Workflow
      ├── Search
      └── Analytics
```

## 7. Repository Strategy

Module does not equal repository.

Initially related modules may share a repository while preserving bounded-context boundaries.

Split repositories when independent:

- deployment
- ownership
- release lifecycle
- security boundary
- scaling requirements
- team ownership

justify separation.

## 8. Deployment Modes

Supported architectural target:

### Shared SaaS

One application/infrastructure, multiple businesses.

### Dedicated deployment

One customer gets an isolated application/database.

### Customer-owned database

The application points to a customer-controlled database.

The domain model must not depend on a particular deployment mode.
