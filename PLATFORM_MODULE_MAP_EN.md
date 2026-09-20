# Platform Module Map

## 1. Purpose

This document defines the modular architecture for the SmartCore ecosystem.

The goal is to identify:

- which capabilities should be reusable modules
- which domain owns each concept
- which capabilities provide services to other modules
- how modules communicate
- where data ownership belongs
- which boundaries may eventually become independent repositories or services
- how `SmartCoreServiceBusiness` fits into the overall ecosystem

The primary architectural principle is:

> **Build Once. Configure Many Times.**

`SmartCoreServiceBusiness` is not intended to contain every capability required by a service business.

Instead, it is a domain application that consumes reusable platform capabilities.

---

# 2. Architectural Principles

## 2.1 Module != Repository

A module is a logical domain boundary.

A repository is a physical code boundary.

These are not necessarily the same.

For example:

```text
Finance
├── Payment
├── Billing
├── Invoice
├── Ledger
└── Settlement
```

may initially exist in one repository while still being treated as separate bounded capabilities.

Only when operational, organizational, scaling, ownership, or deployment requirements justify it should a module become an independent repository/service.

---

## 2.2 Single Domain Ownership

Every important concept must have one clear owner.

For example:

```text
Person           → Identity
Organization     → Organization / Tenancy
Permission       → Authorization
Appointment      → Scheduling
Payment          → Finance / Payment
Notification     → Communication
Service          → Service Business
Resource         → Resource
File             → Media
Audit Event      → Audit
```

No module should maintain a second authoritative copy of another module's domain object.

---

## 2.3 No Cross-Module Database Ownership

A module must never directly modify another module's database tables.

Bad:

```text
ServiceBusiness
    ↓
UPDATE finance.payments
```

Good:

```text
ServiceBusiness
    ↓
Payment API / Contract
    ↓
Finance
```

or:

```text
ServiceBusiness
    ↓
Domain Event
    ↓
Finance
```

---

## 2.4 No Circular Dependencies

Dependencies must form a directed graph.

For example:

```text
Identity
   ↓
Organization
   ↓
Service Business
   ↓
Scheduling
   ↓
Finance
```

A module must not depend on a higher-level module that already depends on it.

Circular dependencies are architectural failures and must be resolved through:

- contracts
- events
- abstractions
- ownership changes

---

## 2.5 Contracts Over Implementations

Modules communicate through:

- APIs
- interfaces
- domain contracts
- integration events
- commands
- queries

They must not depend on another module's internal implementation.

---

## 2.6 Provider Abstraction

External providers must never leak into core business logic.

For example:

```text
Finance
   │
   ├── Payment Provider Interface
   │       ├── Stripe
   │       ├── PayPal
   │       ├── Local Gateway
   │       └── Crypto Provider
   │
   └── Payment Domain
```

The business domain should know:

```text
PaymentProvider
```

not:

```text
ZarinpalPaymentProvider
```

---

# 3. High-Level Ecosystem

The platform is organized into four major groups.

```text
┌───────────────────────────────────────────────────────────┐
│                     FOUNDATION                            │
│                                                           │
│ Identity | Authorization | Organization | Configuration   │
│ Localization | Media | Audit | Event | Observability     │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                    OPERATIONAL                            │
│                                                           │
│ Scheduling | Reservation | Resource | Workflow            │
│ Communication | Notification | Search                     │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                     FINANCIAL                             │
│                                                           │
│ Finance | Payment | Billing | Invoice | Ledger             │
│ Pricing | Settlement                                      │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                  BUSINESS / COMMERCE                      │
│                                                           │
│ Service Business | Commerce | Subscription | Membership   │
│ Marketplace | Referral | Loyalty | Promotion              │
└───────────────────────────────────────────────────────────┘
```

---

# 4. Foundation Modules

## 4.1 Identity

### Purpose

Identity answers:

> Who is this person?

Identity owns authentication and identity continuity.

### Owns

- Person
- Credentials
- Authentication
- Session
- Refresh Token
- Login
- Logout
- Registration
- Personal Identity
- Organization Membership identity

### Does Not Own

- Service Business Customer
- Service Business Staff
- Appointment
- Payment
- Permission semantics
- Business-specific roles

### Example

A person can exist once:

```text
Person
id = p123
```

and participate in multiple businesses:

```text
Person
 ├── Business A → Customer
 ├── Business A → Staff
 ├── Business B → Manager
 └── Business C → Owner
```

Identity does not need to understand the meaning of these business relationships.

---

# 5. Authorization

## Purpose

Authorization answers:

> What is this person allowed to do?

Identity and Authorization are related but distinct.

```text
Identity
    ↓
Who are you?

Authorization
    ↓
What may you do?
```

### Owns

- Permission
- Policy
- Role definitions where generic
- Capability checks
- Access decisions

### Does Not Own

Business-specific domain relationships.

For example:

```text
"Can edit service pricing?"
```

may require:

```text
Authorization
+
Service Business policy
```

---

# 6. Organization / Tenancy

## Purpose

Provides business and tenant context.

### Owns

- Organization
- Tenant
- Membership
- Ownership
- Organization boundaries
- Organization-level context

Example:

```text
Person
   │
   └── Membership
          │
          └── Organization
                 │
                 └── Service Business
```

The same person may belong to multiple organizations.

---

# 7. Configuration

## Purpose

Provides reusable configuration management.

Examples:

- feature flags
- business settings
- operational settings
- module settings
- provider configuration
- environment-specific configuration

Configuration must not become a dumping ground for domain data.

---

# 8. Localization

Localization is a **first-class platform capability**.

It must not be implemented only as a frontend concern.

## 8.1 Locale Layers

There are multiple locale contexts.

### System Locale

The platform-supported locale set.

Example:

```text
fa-IR
en-US
tr-TR
```

### Business Locale

Each business defines:

```text
default_locale
supported_locales[]
```

Example:

```text
Business
├── default_locale: fa-IR
└── supported_locales:
    ├── fa-IR
    ├── en-US
    └── tr-TR
```

### Person Locale

Each person may have:

```text
preferred_locale
```

These must remain separate.

---

## 8.2 Localization Ownership

Localization owns:

- locale definitions
- locale fallback
- translation resolution
- localized templates
- localized system messages
- localization metadata

Business modules own the actual business content.

For example:

```text
Service Business
    owns:
        Service

Localization
    provides:
        translation mechanism
```

---

## 8.3 Translatable Fields

Examples:

```text
Business.name
Business.description

Service.name
Service.description

Category.name

Location.name
Location.description
```

Conceptually:

```text
Service
├── id
├── duration
├── price
└── translations
    ├── fa-IR
    │   ├── name
    │   └── description
    ├── en-US
    │   ├── name
    │   └── description
    └── tr-TR
        ├── name
        └── description
```

---

## 8.4 Non-Translatable Data

Examples:

```text
price
duration
status
phone
email
coordinates
IDs
timestamps
```

---

## 8.5 Locale Fallback

Recommended fallback:

```text
Person Preferred Locale
        ↓
Business Default Locale
        ↓
System Default Locale
```

Example:

```text
Person: tr-TR
Business: fa-IR
System: en-US
```

If Turkish translation does not exist:

```text
tr-TR
   ↓
fa-IR
   ↓
en-US
```

---

## 8.6 Stable Error Codes

APIs must not rely on translated error text.

Example:

```json
{
  "code": "APPOINTMENT_SLOT_UNAVAILABLE",
  "message": "The selected time is no longer available.",
  "details": {}
}
```

The stable field is:

```text
code
```

The message may be localized.

---

# 9. Media / File

## Purpose

Reusable file and media management.

### Owns

- File
- Image
- Attachment
- Storage abstraction
- Metadata
- Access policy
- Upload/download lifecycle

### Providers

Could include:

```text
Local Storage
S3
Azure Blob
Dropbox
Other Object Storage
```

Service Business should not contain storage implementation details.

---

# 10. Audit

## Purpose

Records important changes and actions.

### Owns

```text
Actor
Action
Resource
Before
After
Timestamp
Context
```

Example:

```text
Manager changed:

Service.price

from:
1,000,000

to:
1,200,000
```

Audit should be reusable by every domain.

---

# 11. Event Platform

## Purpose

Provides asynchronous communication between modules.

### Owns

- Domain Events
- Integration Events
- Event Bus
- Delivery
- Retry
- Dead Letter
- Event subscriptions

Example:

```text
AppointmentConfirmed
        │
        ├── Communication
        ├── Workflow
        ├── Analytics
        ├── Referral
        └── Loyalty
```

The appointment module should not need to know every consumer.

---

# 12. Observability

Reusable technical capability for:

- logging
- metrics
- tracing
- health checks
- correlation IDs
- diagnostics

Observability should remain infrastructure-oriented rather than becoming part of business domains.

---

# 13. Operational Modules

## 13.1 Scheduling

Scheduling answers:

> When can something happen?

### Owns

- Calendar
- Working Hours
- Availability
- Time Slots
- Blocks
- Overrides
- Scheduling rules

Example:

```text
Calendar
    ↓
Working Hours
    ↓
Availability
    ↓
Time Slots
```

---

# 14. Reservation

Reservation answers:

> What time/resource has been reserved?

### Owns

- Reservation
- Reservation lifecycle
- Reservation state
- Reservation locking
- Cancellation
- Rescheduling

Example:

```text
Reservation
├── subject
├── start
├── end
├── participants
├── resources
└── status
```

Scheduling determines availability.

Reservation claims the availability.

---

# 15. Resource

## Purpose

Represents physical or logical resources required to perform an operation.

Examples:

```text
Room
Chair
Equipment
Vehicle
Treatment Room
Repair Bay
Machine
```

### Model

```text
Resource
├── Resource Type
├── Resource
├── Availability
└── Allocation
```

An appointment may eventually require:

```text
Staff
+
Resource
+
Time
```

Resource must remain reusable outside service businesses.

---

# 16. Workflow

Workflow provides orchestration.

Example:

```text
AppointmentCreated
        ↓
PaymentRequired
        ↓
PaymentSucceeded
        ↓
AppointmentConfirmed
        ↓
24h Reminder
        ↓
AppointmentCompleted
```

### Owns

- Workflow Definition
- Workflow Instance
- Step
- Transition
- Trigger
- Action

Business domains should not contain large orchestration engines.

---

# 17. Communication

Communication provides outbound communication capabilities.

```text
Communication
├── Messaging
│   ├── SMS
│   ├── Email
│   └── Push
├── Template
├── Notification
├── Delivery
└── Preference
```

Business modules emit events.

Communication decides:

- recipient
- channel
- template
- locale
- delivery
- retry

---

# 18. Notification

Notification is logically part of Communication but should remain conceptually distinct from business events.

Example:

```text
AppointmentConfirmed
        ↓
Notification
        ↓
Recipient Preference
        ↓
Localized Template
        ↓
SMS / Email / Push
```

Notifications must normally be asynchronous.

A notification failure must not roll back a successful appointment transaction.

---

# 19. Search

Reusable search capability.

### Owns

- Index
- Query
- Filter
- Facet
- Ranking

Business modules provide searchable domain data.

Search owns the indexing mechanism, not the business source of truth.

---

# 20. Financial Modules

Finance should not be treated as one giant monolithic responsibility.

Conceptually:

```text
Finance
├── Payment
├── Billing
├── Invoice
├── Transaction
├── Ledger
├── Refund
├── Settlement
└── Pricing
```

These may initially live in one repository.

---

# 21. Payment

Payment answers:

> Did money successfully move through a payment mechanism?

### Owns

- Payment
- Payment attempt
- Payment state
- Verification
- Callback processing
- Refund
- Provider integration

Example:

```text
Payment
├── id
├── amount
├── currency
├── provider
├── method
├── status
└── external_reference
```

---

# 22. Payment Provider vs Payment Method

These concepts must not be mixed.

### Provider

Who processes the payment?

```text
Stripe
PayPal
Local Gateway
Crypto Provider
```

### Method

How does the customer pay?

```text
Card
Bank Transfer
Wallet
Crypto
```

---

# 23. Payment Provider Interface

Conceptually:

```typescript
interface PaymentProvider {
  createPayment(
    input: CreatePaymentInput
  ): Promise<PaymentSession>;

  verifyPayment(
    input: VerifyPaymentInput
  ): Promise<PaymentVerification>;

  handleCallback(
    input: PaymentCallbackInput
  ): Promise<PaymentResult>;
}
```

The business domain must not depend directly on a specific provider.

---

# 24. Billing

Billing answers:

> What does the customer owe?

Examples:

- invoice generation
- charges
- billing cycles
- balances
- billing documents

---

# 25. Invoice

Invoice is a financial document.

It may contain:

```text
Invoice
├── number
├── customer
├── items
├── subtotal
├── discount
├── tax
├── total
├── currency
└── status
```

---

# 26. Ledger

Ledger provides financial accounting records.

The ledger should be append-oriented and auditable.

Business domains should not directly modify ledger entries.

---

# 27. Pricing

Pricing answers:

> How much should something cost?

Possible capabilities:

- base price
- dynamic pricing
- discounts
- pricing rules
- currency
- effective dates

A service business may own the fact that a service has a price.

Pricing may own reusable pricing mechanisms.

---

# 28. Settlement

Settlement handles:

- provider settlement
- business settlement
- marketplace settlement
- commissions
- payout lifecycle

This becomes especially important when Marketplace functionality is introduced.

---

# 29. Service Business

Current repository implementation is limited to the Service Business Phase 1 foundation: Business, Business Profile, Business Location, Service Category, Service, and Business Policy. The capabilities described below are ownership boundaries and future integration targets unless explicitly implemented by the current Phase 1 backend.

`SmartCoreServiceBusiness` is a **domain application**, not the platform foundation.

## Frontend Architecture Decision (Target Only)

The Frontend is not implemented in this repository. The approved target uses TypeScript, Next.js App Router, React, Tailwind CSS, shadcn/ui, TanStack Query for server state, React Hook Form with Zod, and next-intl. Zustand is optional and reserved for genuine complex shared client state. Persian and RTL support are first-class requirements.

The target includes reusable Public Web and Admin Dashboard applications. Both consume the backend HTTP API through a future OpenAPI contract and generated TypeScript API client; neither may import backend Domain, Application, Infrastructure, or repository code. No OpenAPI document, generated client, frontend directory, or frontend package exists currently.

Its purpose is to model businesses that sell or provide services.

## Owns

### Business

- Business profile
- Business identity within the domain
- Business policies
- Business configuration

### Service Catalog

- Service
- Service Category
- Service definition
- Service-specific rules

### Business Relationships

A person may have multiple relationships with the same business.

Examples:

```text
Customer
Staff
Manager
Owner
```

These relationships belong to the business domain, not Identity.

---

# 30. Service Business Must Not Own

The following should not become Service Business implementation responsibilities:

```text
Authentication
Sessions
Generic Identity
Generic Authorization
Generic File Storage
Payment Provider Infrastructure
SMS Provider Infrastructure
Email Infrastructure
Generic Scheduling Engine
Generic Resource Engine
Generic Workflow Engine
Generic Notification Engine
Generic Localization Engine
Generic Audit Engine
Generic Event Bus
Generic Search Engine
Generic Accounting Ledger
```

Service Business consumes these capabilities.

---

# 31. Customer Relationship

Service Business may define:

```text
BusinessCustomer
```

This represents the relationship:

```text
Person
    ↓
Business
    ↓
Customer
```

It is not the same thing as Identity's Person.

---

# 32. Staff Relationship

Similarly:

```text
BusinessStaff
```

represents:

```text
Person
    ↓
Business
    ↓
Staff
```

The same person can simultaneously be:

```text
Customer
+
Staff
+
Manager
```

within the same business.

Therefore:

```text
user.role
```

is not an acceptable core model.

---

# 33. Example Identity + Business Model

```text
Person
  │
  ├── Membership → Business A
  │
  └── Membership → Business B

Business A
  ├── Customer Relationship
  ├── Staff Relationship
  └── Manager Relationship

Business B
  └── Owner Relationship
```

Identity answers:

> Who is this?

Service Business answers:

> What is this person's relationship with this business?

Authorization answers:

> What may this person do?

---

# 34. Commerce

Commerce is a reusable business capability.

Potential scope:

```text
Commerce
├── Product
├── Catalog
├── Cart
├── Order
├── Promotion
├── Coupon
├── Gift Card
├── Bundle
└── Membership
```

Not every service business needs Commerce.

Therefore Commerce should not be forced into the Service Business core.

---

# 35. Subscription

Subscription supports recurring business relationships.

```text
Subscription
├── Plan
├── Subscription
├── Renewal
├── Entitlement
└── Cancellation
```

Examples:

- gym membership
- beauty membership
- maintenance contract
- premium service plan

---

# 36. Membership

Membership represents recurring or privileged customer participation.

It can be consumed by:

- Service Business
- Commerce
- Subscription
- Loyalty

Membership should not be confused with Identity's organization membership.

There are two different concepts:

```text
Organization Membership
    → Person belongs to organization

Business Membership
    → Customer has a commercial/business membership
```

---

# 37. Marketplace

Marketplace is a higher-level commerce capability.

Potential responsibilities:

- multiple sellers/providers
- marketplace listings
- commissions
- seller onboarding
- settlement
- marketplace orders

Marketplace should consume:

```text
Identity
Organization
Finance
Payment
Commerce
Settlement
```

It should not become part of Service Business merely because some service businesses may eventually participate in marketplaces.

---

# 38. Referral

Referral is a reusable growth capability.

Conceptually:

```text
Referral
├── Referral Identity
│   └── Referral Code / Token
│
├── Referral Relationship
│   ├── Referrer
│   ├── Referred
│   ├── Attribution
│   └── Created At
│
├── Referral Lifecycle
│   ├── Pending
│   ├── Qualified
│   ├── Rewarded
│   └── Reversed
│
└── Referral Events
```

Reward types may include:

```text
Percentage
Fixed Credit
Discount
Commission
Wallet Credit
```

Referral must support:

- attribution locking
- expiry
- reward caps
- anti-self-referral
- fraud detection
- reversal

Referral should remain independent from Service Business.

---

# 39. Loyalty

Loyalty may provide:

- points
- tiers
- rewards
- customer status
- redemption

It can consume events such as:

```text
OrderCompleted
AppointmentCompleted
PaymentSucceeded
```

---

# 40. Promotion

Promotion provides reusable promotional mechanisms:

```text
Promotion
Coupon
Discount
Campaign
Eligibility Rule
```

A business can consume Promotion without owning the promotion engine.

---

# 41. Dependency Direction

The preferred dependency direction is:

```text
                  FOUNDATION
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
  Operational      Financial         Commerce
       │               │                │
       └───────────────┼────────────────┘
                       ▼
                Business Domains
```

More concretely:

```text
Identity
   ↓
Organization / Tenancy
   ↓
Authorization
   ↓
Business Domains
```

and independently:

```text
Scheduling
Resource
Workflow
Communication
Finance
Commerce
Subscription
Referral
Loyalty
```

are reusable capabilities consumed through contracts.

---

# 42. Example Service Business Flow

Consider booking a service with a deposit.

```text
Customer
   │
   ▼
Identity
   │
   ▼
Service Business
   │
   ├── Validate Service
   │
   ├── Check Business Policy
   │
   ▼
Scheduling
   │
   ├── Availability
   ├── Working Hours
   └── Time Slot
   │
   ▼
Resource
   │
   └── Staff / Room / Equipment
   │
   ▼
Reservation
   │
   ▼
Finance / Payment
   │
   ├── Create Payment
   ├── Verify Payment
   └── Record Transaction
   │
   ▼
Event Platform
   │
   └── AppointmentConfirmed
          │
          ├── Communication
          ├── Workflow
          ├── Loyalty
          └── Referral
```

Service Business orchestrates domain intent but does not implement all these capabilities internally.

---

# 43. Appointment Ownership

An appointment is a business concept but its scheduling mechanics are reusable.

Therefore:

```text
Service Business
    owns:
        Service Booking Intent
        Business Policy
        Service Context

Scheduling / Reservation
    owns:
        Time
        Reservation
        Availability
        Resource Allocation
```

This distinction prevents Service Business from becoming a giant monolith.

---

# 44. Booking Example

A booking request may conceptually contain:

```json
{
  "business_id": "business-123",
  "service_id": "service-456",
  "staff_id": "staff-789",
  "start": "2026-09-20T15:00:00",
  "duration": 60,
  "customer_id": "person-123"
}
```

Service Business validates:

```text
Does this service exist?
Is it bookable?
What is the business policy?
Is this customer allowed to book?
Is a deposit required?
```

Scheduling validates:

```text
Is the time available?
```

Resource validates:

```text
Is the required staff/resource available?
```

Finance validates:

```text
Was the required payment successfully completed?
```

---

# 45. Event-Driven Integration

Preferred integration pattern:

```text
Domain Module
      │
      ▼
Domain Event
      │
      ▼
Event Platform
      │
      ├── Consumer A
      ├── Consumer B
      ├── Consumer C
      └── Consumer D
```

Example:

```text
AppointmentConfirmed
```

may be consumed by:

```text
Communication
Workflow
Loyalty
Referral
Analytics
```

Service Business should not directly call every consumer unless synchronous behavior is genuinely required.

---

# 46. Synchronous vs Asynchronous Communication

Use synchronous APIs when an immediate answer is required.

Examples:

```text
Check Availability
Create Payment
Verify Payment
Get Business
Get Service
```

Use events when the operation can happen independently.

Examples:

```text
AppointmentConfirmed
PaymentSucceeded
CustomerRegistered
AppointmentCompleted
```

---

# 47. Data Ownership Matrix

| Concept | Owner |
|---|---|
| Person | Identity |
| Credentials | Identity |
| Session | Identity |
| Organization | Organization / Tenancy |
| Membership | Organization / Tenancy |
| Permission | Authorization |
| Business | Service Business |
| Customer Relationship | Service Business |
| Staff Relationship | Service Business |
| Service | Service Business |
| Service Category | Service Business |
| Calendar | Scheduling |
| Availability | Scheduling |
| Reservation | Reservation |
| Resource | Resource |
| Resource Allocation | Resource |
| Payment | Finance |
| Payment Attempt | Finance |
| Invoice | Billing |
| Ledger Entry | Ledger |
| Pricing Rule | Pricing |
| Notification | Communication |
| Message Template | Communication |
| File | Media |
| Audit Event | Audit |
| Workflow | Workflow |
| Search Index | Search |
| Referral | Referral |
| Loyalty Account | Loyalty |
| Subscription | Subscription |
| Product | Commerce |
| Order | Commerce |

---

# 48. Module Interaction Rules

## Rule 1

Never access another module's database directly.

## Rule 2

Never import another module's internal domain implementation.

## Rule 3

Use stable contracts.

## Rule 4

Use events for decoupled reactions.

## Rule 5

Avoid synchronous chains longer than necessary.

Bad:

```text
A → B → C → D → E → F
```

Prefer:

```text
A
 ↓
Event
 ↓
B
C
D
E
```

when the operations are independent.

## Rule 6

Every module owns its own data.

## Rule 7

Every external provider must be behind an adapter.

## Rule 8

Localization must be supported at the domain/platform level.

## Rule 9

Business-specific semantics must not leak into generic platform modules.

## Rule 10

Generic modules must remain usable outside Service Business.

---

# 49. Module vs Repository Decision

A module should become an independent repository only when one or more of these conditions are true:

- independent deployment is required
- independent scaling is required
- independent ownership is required
- different release lifecycle
- strong security boundary
- different technology requirements
- external consumers need a stable public API
- operational complexity justifies separation

Otherwise:

> Keep it as a module inside a larger repository.

---

# 50. Recommended Initial Repository Strategy

The logical architecture may look like:

```text
SmartCore/
├── Identity/
├── Authorization/
├── Organization/
├── Localization/
├── Configuration/
├── Media/
├── Audit/
├── Event/
├── Observability/
│
├── Scheduling/
├── Reservation/
├── Resource/
├── Workflow/
├── Communication/
├── Search/
│
├── Finance/
│   ├── Payment/
│   ├── Billing/
│   ├── Invoice/
│   ├── Ledger/
│   ├── Pricing/
│   └── Settlement/
│
├── ServiceBusiness/
├── Commerce/
├── Subscription/
├── Marketplace/
├── Referral/
├── Loyalty/
└── Promotion/
```

This is a **logical architecture**, not a requirement that every directory becomes a separate Git repository.

---

# 51. Candidate Core Platforms

The first reusable platforms with the highest strategic value are:

```text
Identity
Authorization
Organization
Localization
Finance
Communication
Scheduling
Resource
Workflow
Media
Audit
Event
```

These capabilities are likely to be consumed by many future products.

---

# 52. Service Business MVP Dependency Set

The first Service Business implementation should not implement the entire ecosystem.

Its initial dependencies can be:

```text
Identity
   │
Organization
   │
Authorization
   │
Localization
   │
Service Business
   │
   ├── Scheduling
   ├── Reservation
   ├── Resource
   ├── Finance / Payment
   ├── Communication
   └── Event
```

Other capabilities can be added later:

```text
Commerce
Subscription
Marketplace
Referral
Loyalty
Promotion
```

---

# 53. Example Product Ecosystem

The architecture should allow future products such as:

```text
Beauty Salon
Clinic
Barbershop
Repair Shop
Car Service
Cleaning Company
Fitness Center
Consulting Business
Photography Studio
Dental Clinic
Pet Care
Home Services
Equipment Rental
```

without rewriting the platform foundation.

The difference between these products should primarily be:

```text
Configuration
+
Business Rules
+
Domain Extensions
```

not duplicated infrastructure.

---

# 54. Example Beauty Salon

A beauty salon may configure:

```text
Business Type:
    Beauty Salon

Services:
    Haircut
    Hair Coloring
    Facial
    Manicure

Resources:
    Hairdresser
    Chair
    Treatment Room

Scheduling:
    Appointment

Payment:
    Deposit

Communication:
    SMS
    Email

Localization:
    fa-IR
    en-US
    tr-TR
```

None of these should require changing Identity.

---

# 55. Generic Product Boundary

The generic product should answer:

> How do we operate a service-based business?

It should not answer:

> How does one specific salon operate?

Therefore customer-specific rules belong in deployment/configuration or domain extensions.

---

# 56. Configuration vs Custom Development

Use configuration for:

- business name
- logo
- supported languages
- currency
- timezone
- business hours
- service catalog
- payment providers
- notification channels
- booking policies
- deposit rules

Use custom domain development only when the business introduces genuinely new behavior.

---

# 57. Multilingual API Principle

APIs should support locale explicitly where needed.

Example:

```http
GET /api/public/business/{slug}?locale=fa-IR
```

or:

```http
Accept-Language: fa-IR
```

The exact mechanism can be decided during API design, but localization must be part of the contract.

---

# 58. Multilingual Admin

Administrative interfaces should also support localization.

The system should distinguish:

```text
UI Translation
```

from:

```text
Business Content Translation
```

For example:

```text
"Save Service"
```

is UI translation.

```text
"Hair Coloring"
```

is business content translation.

They must not be stored using the same conceptual mechanism.

---

# 59. Localization of Notifications

A notification should resolve locale approximately as:

```text
Recipient Preferred Locale
        ↓
Business Default Locale
        ↓
System Default Locale
```

Example:

```text
AppointmentConfirmed
        ↓
Customer locale = tr-TR
        ↓
Turkish template
        ↓
SMS
```

The business event itself remains language-neutral.

---

# 60. Architectural Summary

The final architecture is based on one important idea:

> `SmartCoreServiceBusiness` is a consumer of reusable capabilities, not the owner of every capability it needs.

The platform should therefore separate:

```text
Identity
Authorization
Organization
Localization
Finance
Communication
Scheduling
Reservation
Resource
Workflow
Media
Audit
Event
```

from the actual business domain:

```text
Service Business
```

and allow optional higher-level capabilities:

```text
Commerce
Subscription
Marketplace
Referral
Loyalty
Promotion
```

to be attached when required.

---

# 61. Target Architecture

```text
                              ┌───────────────────┐
                              │     Identity      │
                              │ Person / Auth     │
                              │ Session           │
                              └─────────┬─────────┘
                                        │
                              ┌─────────▼─────────┐
                              │ Organization /    │
                              │ Tenancy           │
                              └─────────┬─────────┘
                                        │
                              ┌─────────▼─────────┐
                              │ Authorization     │
                              └─────────┬─────────┘
                                        │
                    ┌───────────────────▼───────────────────┐
                    │          SERVICE BUSINESS             │
                    │                                       │
                    │ Business                              │
                    │ Customer Relationships                │
                    │ Staff Relationships                   │
                    │ Service Catalog                       │
                    │ Business Policies                     │
                    └───────┬────────┬────────┬─────────────┘
                            │        │        │
             ┌──────────────┘        │        └──────────────┐
             ▼                       ▼                       ▼
       Scheduling              Resource                  Finance
             │                       │                       │
             ▼                       ▼                       ▼
       Reservation             Allocation               Payment
                                                            │
                                                            ▼
                                                     Billing / Ledger


        ┌────────────────────────────────────────────────────────┐
        │                CROSS-CUTTING CAPABILITIES              │
        │                                                        │
        │ Localization | Event | Communication | Media | Audit  │
        │ Workflow     | Search | Observability | Configuration │
        └────────────────────────────────────────────────────────┘


        ┌────────────────────────────────────────────────────────┐
        │                 OPTIONAL CAPABILITIES                  │
        │                                                        │
        │ Commerce | Subscription | Marketplace | Referral      │
        │ Loyalty  | Promotion                                   │
        └────────────────────────────────────────────────────────┘
```

---

# 62. Final Architectural Rule

Before implementing a new feature, ask:

1. Is this specific to Service Business?
2. Could another product use it?
3. Does another module already own this concept?
4. Is this a reusable capability?
5. Should it be synchronous or event-driven?
6. Does it require its own data ownership?
7. Does it need localization?
8. Does it integrate with an external provider?
9. Is it a domain responsibility or infrastructure responsibility?
10. Does implementing it here create unnecessary coupling?

If the answer indicates reuse, the capability should become a module rather than being embedded directly into `SmartCoreServiceBusiness`.

---

# 63. Architectural Goal

The final ecosystem should allow:

```text
                    Reusable Platform
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   Service Business     Commerce         Marketplace
          │                │                │
          ▼                ▼                ▼
       Salon            Online Shop      Multi-Vendor
          │
          ▼
   Customer Deployment
```

with shared capabilities underneath:

```text
Identity
Authorization
Organization
Localization
Finance
Communication
Scheduling
Resource
Workflow
Media
Audit
Event
```

The resulting system should allow new products to be created primarily through:

```text
Configuration
+
Composition
+
Business Rules
+
Domain Extensions
```

rather than copying and rewriting the platform for every customer.