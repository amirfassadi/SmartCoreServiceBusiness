# SmartCoreServiceBusiness

Generic, reusable Service Business application built on the SmartCore modular ecosystem.

> **Build Once. Configure Many Times.**

This repository is intentionally business-generic. It must not contain customer-specific branding, service definitions, payment-provider assumptions, or deployment-specific business rules.

## Purpose

SmartCoreServiceBusiness provides the domain application for service-based businesses such as:

- Beauty salons
- Clinics
- Repair centers
- Consulting businesses
- Training centers
- Fitness businesses
- Home services
- Automotive service centers

## Current Implementation

The current repository implements the Service Business Phase 1 backend:

- Business and BusinessProfile
- BusinessLocation
- BusinessPolicy with versioned persistence
- ServiceCategory and Service
- Business and Organization-scoped repository isolation
- REST API, DTO validation, stable error mapping, Prisma persistence, and tests

Identity, Authorization, Customer, Staff, Resource, Availability, Booking/Reservation, Payment/Finance, Deposit, Notification, and SMS integration remain external or deferred boundaries. They are described architecturally but are not production bounded contexts in this repository.

The first deployment may be a beauty salon, but the product boundary remains generic.

## Architectural Position

Service Business is a domain application/consumer inside a broader SmartCore ecosystem.

It consumes reusable capabilities such as:

- Identity
- Authorization
- Organization/Tenancy
- Configuration
- Localization
- Media
- Audit
- Scheduling
- Reservation
- Resource
- Workflow
- Finance
- Payment
- Communication
- Notification
- Search
- Commerce
- Subscription
- Referral
- Loyalty
- Promotion

The authoritative module boundaries are defined in `PLATFORM_MODULE_MAP.md`.

## Core Principle

Service Business owns **service-business meaning and policy**.

It does not own infrastructure or generic capabilities merely because the current deployment needs them.

## Product Boundary

Service Business owns concepts such as:

- Business
- Business profile
- Customer relationship
- Staff relationship
- Service catalog
- Service categories
- Business locations
- Business-specific policies
- Booking intent
- Appointment business state
- Customer-facing service availability rules

It consumes:

- Person identity from Identity
- Organization/tenant context from Organization
- Authentication/session from Identity
- authorization capabilities from Authorization
- time/resource reservation from Scheduling/Reservation/Resource
- financial execution from Finance/Payment
- messages from Communication/Notification
- workflow execution from Workflow

## Genericity Rules

The generic repository must not hard-code:

- a real customer's name
- customer branding
- beauty-only concepts
- a specific payment gateway
- a specific SMS provider
- a specific country
- a single language
- a single currency
- a single timezone
- customer-specific database schema
- customer-specific business rules

Customer-specific configuration belongs in a deployment/configuration layer.

## Multi-Tenancy

The product is multi-business by design.

A person can have multiple relationships with the same business:

```text
Person
  └── Business
       ├── Owner
       ├── Manager
       ├── Staff
       └── Customer
```

A person can also have different relationships in different businesses.

There is no single global `user.role` model.

## Localization

Localization is first-class.

Separate:

1. UI/system translation
2. business-content translation
3. person preferred locale
4. business default locale

Fallback:

`person preferred locale -> business default locale -> system default locale`

## Initial MVP Dependency Set

The minimum useful product should depend on:

1. Identity
2. Authorization
3. Organization/Tenancy
4. Configuration
5. Localization
6. Scheduling
7. Reservation
8. Resource
9. Finance/Payment
10. Communication/Notification
11. Audit
12. Media where required

Other modules can be integrated later.

## Documentation

- `PLATFORM_MODULE_MAP.md` — master ecosystem/module map
- `PRODUCT.md` — product definition
- `ARCHITECTURE.md` — application architecture
- `DOMAIN_MODEL.md` — domain model and ownership
- `IDENTITY_INTEGRATION.md` — identity/organization integration
- `TENANCY.md` — tenancy and ownership
- `BOOKING.md` — booking and reservation rules
- `PAYMENT.md` — payment/finance integration
- `NOTIFICATION.md` — communication and notification integration
- `LOCALIZATION.md` — multilingual architecture
- `API.md` — API contract
- `DATA_MODEL.md` — persistence model
- `EXTENSIBILITY.md` — configuration and extensibility
- `MVP.md` — MVP scope and acceptance criteria
- `SECURITY.md` — security rules
- `OBSERVABILITY.md` — logging/metrics/tracing
- `ROADMAP.md` — evolution plan

## Architectural Rule

> A reusable capability belongs to its own platform/module boundary. Service Business consumes it through a stable contract and owns only the business semantics specific to service businesses.
