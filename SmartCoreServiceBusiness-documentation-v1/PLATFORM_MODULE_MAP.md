# SmartCore Platform Module Map

> **Master Architecture Document**

## 1. Purpose

This document defines the authoritative module boundaries for the SmartCore ecosystem used by Service Business.

The purpose is to prevent Service Business from becoming a monolith that absorbs every reusable capability.

## 2. Architectural Principle

> Build Once. Configure Many Times.

And:

> Module ≠ Repository.

A module is a domain/capability boundary. A repository is a source-control/deployment boundary.

## 3. Foundation / Platform

### Identity

Owns:

- Person
- authentication
- credentials
- sessions
- identity lifecycle
- organization membership primitives

Does not own business-specific capabilities.

### Authorization

Owns reusable authorization mechanics.

Answers:

> What may this actor do?

### Organization / Tenancy

Owns:

- organization
- ownership
- membership context
- tenant boundaries

### Configuration

Owns reusable configuration mechanisms.

### Localization

Owns locale mechanics and localization infrastructure.

Business modules own the meaning/content being translated.

### Media / File

Owns file/media abstraction, storage, metadata, access policy.

### Audit

Owns audit records and audit infrastructure.

### Event Platform

Owns domain/integration event delivery, retries, dead letters and event infrastructure.

### Observability

Owns cross-cutting telemetry.

## 4. Operational

### Scheduling

Owns:

- calendar
- availability
- working hours
- time slots
- blocks

### Reservation

Owns:

- reservation
- conflict prevention
- reservation lifecycle

### Resource

Owns:

- resource type
- resource
- availability
- allocation

### Workflow

Owns:

- workflow definition
- instance
- steps
- transitions
- triggers
- actions

### Communication

Owns:

- messaging
- templates
- notification
- delivery
- preferences

### Search

Owns indexing, query, filters, facets and ranking.

## 5. Financial

Finance is conceptually decomposed into:

- Payment
- Billing
- Invoice
- Transaction
- Ledger
- Refund
- Settlement
- Pricing

Service Business owns policy; Finance owns financial execution.

### Payment Provider Contract

```typescript
interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<PaymentSession>;
  verifyPayment(input: VerifyPaymentInput): Promise<PaymentVerification>;
  handleCallback(input: PaymentCallbackInput): Promise<PaymentResult>;
}
```

The generic product must not hard-code a payment provider.

## 6. Business / Commerce

### Service Business

Owns:

- Business
- customer relationship
- staff relationship
- service catalog
- business locations
- business policies
- appointment business semantics

Must not own generic:

- authentication
- payment gateway
- notification provider
- storage
- workflow engine
- search engine

### Commerce

Owns:

- Product
- Catalog
- Cart
- Order
- Promotion
- Coupon
- Gift Card
- Bundle

### Subscription

Owns:

- Plan
- Subscription
- Renewal
- Entitlement
- Cancellation

### Membership

Owns reusable membership concepts where distinct from Identity membership.

### Marketplace

Owns multi-provider marketplace semantics.

### Referral

Owns:

- referral code/token
- referrer/referred relationship
- attribution
- lifecycle
- rewards
- reversal/fraud rules

### Loyalty

Owns points/rewards/tiers.

### Promotion

Owns discounts and promotional rules.

## 7. Dependency Direction

Preferred:

```text
Foundation
    ↑
Operational / Financial capabilities
    ↑
Domain Applications
```

More precisely, higher-level applications consume lower-level reusable capabilities through contracts.

Avoid:

```text
Payment → Service Business implementation
Identity → Service Business database
Notification → Service Business internals
```

## 8. Service Business Example

```text
Person
  ↓
Identity
  ↓
Business / Organization context
  ↓
Service Business
  ├── Customer
  ├── Staff
  ├── Service
  ├── Location
  └── Appointment intent
          ↓
      Scheduling
          ↓
      Reservation
          ↓
       Resource
          ↓
       Finance
          ↓
      Payment
          ↓
    Event Platform
       ├── Notification
       ├── Workflow
       ├── Search
       └── Analytics
```

## 9. Data Ownership Matrix

| Capability | Owns |
|---|---|
| Identity | Person, Auth, Session |
| Organization | Organization, Ownership, Membership |
| Authorization | Authorization mechanics |
| Localization | Locale infrastructure |
| Service Business | Business domain semantics |
| Scheduling | Time/availability |
| Reservation | Reservation/conflicts |
| Resource | Resource allocation |
| Finance | Financial state |
| Payment | Payment execution |
| Communication | Message delivery |
| Workflow | Process orchestration |
| Media | Files/storage abstraction |
| Audit | Audit trail |
| Event Platform | Event delivery |
| Commerce | Products/orders |
| Subscription | Subscription lifecycle |
| Referral | Referral lifecycle |
| Loyalty | Loyalty |
| Promotion | Promotion rules |

## 10. Multilingual Architecture

Business:

```text
Business
├── default_locale
├── supported_locales
└── localized content
```

Person:

```text
Person
└── preferred_locale
```

Fallback:

`person preferred -> business default -> system default`

API errors use stable codes with localized messages.

## 11. Sync vs Async

Synchronous:

- identity lookup
- authorization
- availability
- reservation
- payment-session creation

Asynchronous:

- notification
- reminder
- analytics
- search indexing
- referral processing
- workflow side effects

## 12. Module vs Repository

Start with fewer repositories and strong internal boundaries.

Split when independent:

- ownership
- release cycle
- deployment
- scaling
- security
- team

## 13. Initial Repository Strategy

A practical initial ecosystem may contain:

- SmartCorePlatform / foundation
- SmartCoreServiceBusiness
- Finance capability/repository
- Communication capability/repository
- Scheduling/Reservation capability/repository
- future Commerce/Subscription/etc.

The exact split should follow operational independence rather than theoretical purity.

## 14. Final Rule

Service Business is not the center of the universe.

It is one domain application in a reusable platform ecosystem.

Any capability with independent meaning and reuse potential should be modeled as a reusable module instead of being embedded permanently in Service Business.
