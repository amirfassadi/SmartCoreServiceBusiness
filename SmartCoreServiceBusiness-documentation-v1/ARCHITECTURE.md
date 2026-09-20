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

The current backend implements these layers for the Phase 1 Service Business scope:

- **Presentation:** NestJS HTTP controller, DTO validation, request context adapter, response mappers, and stable HTTP error mapping.
- **Application:** Business, Location, ServiceCategory, Service, and BusinessPolicy use cases coordinating ports and lifecycle rules.
- **Domain:** Business-owned entities, value objects, repository ports, and domain errors/events.
- **Infrastructure:** Prisma schema, migrations, Prisma repositories, and external integration boundaries.
- **Shared:** Request context and stable error-code contracts used across layers.

The dependency direction is Presentation -> Application -> Domain/ports, with Infrastructure implementing the ports. Domain code does not depend on Prisma or HTTP.

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

## 9. Frontend Architecture Decision (Target)

The Frontend is not implemented in the current repository. The approved target uses TypeScript, Next.js App Router, React, Tailwind CSS, shadcn/ui, TanStack Query for server/API state, React Hook Form with Zod, next-intl, and optional Zustand only for genuine complex shared client state. Persian and RTL support are required from the beginning.

The target has two primary applications: Public Web for customer-facing Business, profile, location, category, and Service experiences; and Admin Dashboard for Business, Profile, Location, Policy, ServiceCategory, Service, and lifecycle management. Booking, Staff, Payment, Deposit, Notification, and other future capabilities remain deferred according to backend boundaries.

Frontend dependency boundary:

```text
Backend Domain -> Application -> HTTP API -> OpenAPI Contract (future) -> Generated TypeScript API Client (future) -> Frontend
```

No OpenAPI document, generated client, Frontend directory, or Frontend package exists currently. The conceptual target monorepo structure must not be created in this backend repository during Phase 1.

### Current versus target status

- **Currently implemented:** Phase 1 backend HTTP API and DTO validation for Business, Profile, Location, ServiceCategory, Service, and BusinessPolicy.
- **Planned:** OpenAPI contract, generated TypeScript API client, Public Web, Admin Dashboard, shared UI, validation, configuration, and i18n packages.
- **Deferred:** Booking UI, Staff, Resource, Availability, Payment, Deposit, Notification/SMS, and Identity/Authorization UI or integrations.

Target sequence: backend stabilization -> API contract audit -> API stabilization -> Identity/authentication boundary -> OpenAPI -> generated API client -> Frontend foundation -> shared UI/design system -> Admin Dashboard -> Public Business Website -> Booking UI -> additional platform modules.
