# Phase 1 Implementation Blueprint

**Status:** Approved implementation blueprint
**Scope:** Service Business domain foundation only
**Repository:** `SmartCoreServiceBusiness`

> This blueprint converts the repository's authoritative architecture and Phase 1 specification into an implementation contract. It does not expand the approved Phase 1 scope.

## 1. Source of Truth and Precedence

The implementation must follow, in order of architectural authority:

1. `README.md`
2. `SmartCoreServiceBusiness-documentation-v1/ARCHITECTURE.md`
3. `SmartCoreServiceBusiness-documentation-v1/DOMAIN_MODEL.md`
4. `SmartCoreServiceBusiness-documentation-v1/DATA_MODEL.md`
5. `SmartCoreServiceBusiness-documentation-v1/PLATFORM_MODULE_MAP.md`
6. `SmartCoreServiceBusiness-documentation-v1/IDENTITY_INTEGRATION.md`
7. `SmartCoreServiceBusiness-documentation-v1/TENANCY.md`
8. `SmartCoreServiceBusiness-documentation-v1/SECURITY.md`
9. `SmartCoreServiceBusiness-documentation-v1/BOOKING.md`
10. `SmartCoreServiceBusiness-documentation-v1/PAYMENT.md`
11. `SmartCoreServiceBusiness-documentation-v1/NOTIFICATION.md`
12. `SmartCoreServiceBusiness-documentation-v1/LOCALIZATION.md`
13. `SmartCoreServiceBusiness-documentation-v1/OBSERVABILITY.md`
14. `SmartCoreServiceBusiness-documentation-v1/PRODUCT.md`
15. `SmartCoreServiceBusiness-documentation-v1/MVP.md`
16. `PHASE_1_IMPLEMENTATION_SPEC.md`

Implementation conventions such as NestJS/Prisma/Jest are subordinate to the architecture.

## 2. Phase Terminology Clarification

The ecosystem roadmap uses **Phase 1** for platform foundation and **Phase 2** for Service Business Core. This repository's implementation specification uses **Phase 1** for the Service Business domain foundation.

These are different planning dimensions. This repository must use the explicit term **Service Business Repository Phase 1** when ambiguity is possible.

## 3. Phase 1 Scope

### Included

- Business
- Business Profile
- Business Location
- Service Category
- Service
- Business Policy
- Tenant/business isolation
- Repository ports
- Persistence implementation
- Application use cases
- REST API for the above
- Validation and stable error codes
- Audit/event integration boundaries
- Structured observability hooks
- Unit and integration tests

### Explicitly excluded

- Appointment
- Booking
- Availability engine
- Reservation execution
- Resource allocation
- Payment execution/provider integration
- Payment database or ledger
- Notification transport/delivery
- Identity/authentication/session implementation
- Organization/Tenancy implementation
- Generic authorization engine
- Customer/staff identity ownership
- Scheduling implementation

## 4. Ownership Model

Service Business owns business-specific semantics. It consumes reusable platform capabilities through contracts.

| Capability | Service Business responsibility |
|---|---|
| Identity | Consume Person/identity references |
| Organization/Tenancy | Consume organization/tenant context |
| Authorization | Consume authorization decisions |
| Localization | Own business content; consume locale infrastructure |
| Media | Store media references only |
| Scheduling | Consume future availability contracts |
| Reservation | Store reservation references only |
| Resource | Store resource references only |
| Finance/Payment | Define local requirement policy only |
| Communication/Notification | Emit events; never deliver directly |
| Audit | Emit/record audit integration events |
| Observability | Emit structured telemetry |

No external capability may be duplicated as a local source of truth.

## 5. Target Project Structure

```text
SmartCoreServiceBusiness/
├── src/
│   ├── domain/
│   │   ├── business/
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   └── business.repository.port.ts
│   │   ├── business-location/
│   │   │   ├── entities/
│   │   │   └── business-location.repository.port.ts
│   │   ├── service-category/
│   │   │   ├── entities/
│   │   │   └── service-category.repository.port.ts
│   │   ├── service/
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   └── service.repository.port.ts
│   │   ├── business-policy/
│   │   │   ├── entities/
│   │   │   └── business-policy.repository.port.ts
│   │   └── shared/
│   │       ├── domain-error.ts
│   │       └── domain-events.ts
│   ├── application/
│   │   ├── business/
│   │   ├── business-location/
│   │   ├── service-category/
│   │   ├── service/
│   │   └── business-policy/
│   ├── infrastructure/
│   │   ├── persistence/
│   │   │   └── prisma/
│   │   │       ├── schema.prisma
│   │   │       ├── migrations/
│   │   │       └── repositories/
│   │   ├── integrations/
│   │   └── observability/
│   ├── presentation/
│   │   └── http/
│   │       ├── business/
│   │       ├── business-location/
│   │       ├── service-category/
│   │       ├── service/
│   │       └── business-policy/
│   └── shared/
│       ├── context/
│       ├── errors/
│       └── validation/
├── test/
│   ├── unit/
│   └── integration/
├── prisma/
├── package.json
├── tsconfig.json
└── README.md
```

`ServiceCatalog` is not a separate module, aggregate, repository, or table. It is a conceptual catalog boundary grouping `ServiceCategory` and `Service`.

## 6. Domain Model

### Business aggregate root

Fields:

- id
- organizationId
- slug
- defaultLocale
- supportedLocales
- timezone
- currency
- status
- createdAt
- updatedAt
- deletedAt (only if implementation confirms soft deletion is required)

Status values:

- draft
- active
- suspended
- archived

Creation always starts in `draft`; clients cannot choose the initial status.

### BusinessProfile child

Fields:

- id
- businessId
- name
- description
- logoUrl/media reference
- contactEmail
- createdAt
- updatedAt

Exactly one profile per business. Creation of Business and its initial profile is atomic.

### BusinessLocation child

Fields:

- id
- businessId
- name
- address
- timezone
- active
- createdAt
- updatedAt

Location deactivation is preferred to deletion where history matters.

### ServiceCategory

Business-scoped catalog classification.

Fields:

- id
- businessId
- name/content
- slug
- parentCategoryId (optional)
- createdAt
- updatedAt

Rules:

- category belongs to exactly one business
- parent, when supplied, belongs to the same business
- self-parenting is forbidden
- cross-business parent references are rejected
- category is reusable by multiple services

### Service aggregate root

Fields:

- id
- businessId
- categoryId
- name/content
- slug
- durationMinutes
- active
- createdAt
- updatedAt

Rules:

- categoryId is required and non-null
- category must belong to the same business
- slug unique within business
- duration is positive
- inactive/archived services are not active catalog items
- no local payment, reservation, availability, or resource model

### BusinessPolicy child

Fields:

- id
- businessId
- policyKey
- version
- policyValueJson
- createdAt
- updatedAt

Rules:

- policyKey is immutable
- first version is 1
- updates append a new version
- previous versions are immutable
- unique `(businessId, policyKey, version)`
- policy value must contain only Service Business-owned semantics

## 7. Localization Contract

Localization is architectural, not merely UI behavior.

Business content that may require localization includes:

- business name/description
- service name/description
- category name/description
- location name/description

The implementation may use translation tables or JSON, but domain semantics must remain equivalent.

Locale fallback:

```text
request/person preferred locale
        ↓
business default locale
        ↓
system default locale
```

Explicit request locale must be validated against business-supported locales.

System validation/error codes remain stable; human-readable messages are localizable.

## 8. Repository Ports

### BusinessRepositoryPort

- create business + initial profile atomically
- get by id within owner scope
- get by slug within owner scope
- update business
- update profile
- list businesses within owner scope
- read profile

No separate BusinessProfile repository.

### BusinessLocationRepositoryPort

- create within business
- get by id within business/org scope
- list by business
- update within business
- deactivate

### ServiceCategoryRepositoryPort

- create within business
- get by id within business/org scope
- list by business
- validate parent ownership
- detect duplicate slug

### ServiceRepositoryPort

- create
- update
- archive/deactivate
- get by id
- list by business
- validate category ownership
- detect duplicate slug

### BusinessPolicyRepositoryPort

- create first version
- get current version
- list versions
- append new version
- enforce policy key/version ownership

Repositories must not expose cross-business access methods without an explicit privileged platform contract.

## 9. Application Use Cases

### Business

- CreateBusiness
- GetBusiness
- UpdateBusinessProfile

### Location

- AddBusinessLocation
- GetBusinessLocations
- UpdateBusinessLocation
- DeactivateBusinessLocation

### Service Category

- CreateServiceCategory
- GetServiceCategories

### Service

- CreateService
- GetServices
- UpdateService
- ArchiveService

### Policy

- CreateBusinessPolicy
- GetCurrentBusinessPolicy
- ListBusinessPolicyVersions
- UpdateBusinessPolicy

Every business-scoped command must establish authenticated actor, organization context, business context, and authorization before mutation.

## 10. Request Context and Isolation

The request flow is:

```text
Identity authentication
        ↓
Person identity
        ↓
Organization / tenant context
        ↓
Business context
        ↓
Authorization decision
        ↓
Application use case
        ↓
Repository scoped operation
```

A `businessId` in a URL is only a selector. It is never an authorization grant.

`organizationId` must not be freely client-controlled during business creation or mutation. It comes from established platform context.

Repositories must require ownership scope for business-scoped reads and writes.

## 11. Persistence Model

Initial tables:

- businesses
- business_profiles
- business_locations
- service_categories
- services
- business_policies

Do not create:

- users
- persons
- organizations
- memberships
- permissions
- reservations
- payments
- ledgers
- notification deliveries
- resources

External IDs may be stored as references where required by later integration.

### Required database constraints

- business ownership + slug uniqueness
- one profile per business
- service slug uniqueness within business
- foreign keys for Service Business-owned relations
- category parent same-business enforcement through application/domain validation plus safe persistence strategy
- indexes for businessId and frequently filtered active/status fields
- policy uniqueness on business + key + version

The database is a second line of defense; application/domain checks remain mandatory.

## 12. Transaction Boundaries

### CreateBusiness

Single transaction:

```text
create Business
create initial BusinessProfile
commit
```

### CreateServiceCategory

Validate business and parent ownership, then create category atomically.

### CreateService

Validate business and category ownership, then create service atomically.

### UpdateBusinessPolicy

Single transaction with concurrency protection:

```text
read current version
verify expected/current version
insert next version
commit
```

Do not use distributed transactions across SmartCore modules.

## 13. REST API — Phase 1

API versioning must follow the platform's final convention. If no platform convention exists yet, use an explicit `/api/v1` namespace rather than baking an unversioned public contract into implementation.

Proposed endpoints:

### Businesses

- `POST /api/v1/businesses`
- `GET /api/v1/businesses/:businessId`

### Business Profile

- `PATCH /api/v1/businesses/:businessId/profile`

### Locations

- `POST /api/v1/businesses/:businessId/locations`
- `GET /api/v1/businesses/:businessId/locations`
- `PATCH /api/v1/businesses/:businessId/locations/:locationId`
- `POST /api/v1/businesses/:businessId/locations/:locationId/deactivate`

### Categories

- `POST /api/v1/businesses/:businessId/service-categories`
- `GET /api/v1/businesses/:businessId/service-categories`

### Services

- `POST /api/v1/businesses/:businessId/services`
- `GET /api/v1/businesses/:businessId/services`
- `PATCH /api/v1/businesses/:businessId/services/:serviceId`
- `POST /api/v1/businesses/:businessId/services/:serviceId/archive`

### Policies

- `POST /api/v1/businesses/:businessId/policies`
- `GET /api/v1/businesses/:businessId/policies/:policyKey`
- `GET /api/v1/businesses/:businessId/policies/:policyKey/versions`
- `PUT /api/v1/businesses/:businessId/policies/:policyKey`

No appointment, availability, payment, reservation, staff, or notification endpoint is part of this phase.

## 14. DTO Rules

DTOs belong to the presentation/application boundary, not the domain.

They must validate:

- UUID/identifier format
- required fields
- string lengths
- slug format
- locale format
- supported locale membership
- timezone
- currency
- duration positivity
- JSON policy structure

DTOs must not accept caller-controlled authorization context as a substitute for authenticated platform context.

## 15. Error Contract

API error shape:

```json
{
  "code": "STABLE_ERROR_CODE",
  "message": "localized message",
  "details": {}
}
```

Representative stable codes:

- `BUSINESS_NOT_FOUND`
- `BUSINESS_SLUG_ALREADY_EXISTS`
- `BUSINESS_ACCESS_DENIED`
- `PROFILE_NOT_FOUND`
- `LOCATION_NOT_FOUND`
- `LOCATION_NAME_ALREADY_EXISTS`
- `CATEGORY_NOT_FOUND`
- `CATEGORY_SLUG_ALREADY_EXISTS`
- `INVALID_PARENT_CATEGORY`
- `CROSS_BUSINESS_REFERENCE`
- `SERVICE_NOT_FOUND`
- `SERVICE_SLUG_ALREADY_EXISTS`
- `INVALID_SERVICE_CATEGORY`
- `INVALID_SERVICE_DURATION`
- `POLICY_NOT_FOUND`
- `POLICY_KEY_ALREADY_EXISTS`
- `INVALID_POLICY`
- `POLICY_VERSION_CONFLICT`
- `INVALID_LOCALE`
- `INVALID_TIMEZONE`
- `INVALID_CURRENCY`
- `VALIDATION_ERROR`
- `PERSISTENCE_FAILURE`

HTTP status mapping must remain consistent with the platform API contract: 400, 401, 403, 404, 409, 422, 429, 500, 503 as applicable.

## 16. Events and Audit Boundary

Phase 1 must not build an event platform. It must expose clean domain/integration event boundaries.

Relevant examples include:

- BusinessCreated
- BusinessProfileUpdated
- BusinessLocationCreated
- BusinessLocationDeactivated
- ServiceCategoryCreated
- ServiceCreated
- ServiceArchived
- BusinessPolicyVersionCreated

Events must not contain secrets or external provider credentials.

Important mutations should be auditable through the platform Audit capability.

## 17. Observability

Structured logs should include where applicable:

- correlation/request ID
- business ID
- organization ID
- person ID when permitted
- operation
- outcome
- latency
- dependency
- stable error code

Never log credentials, secrets, or payment credentials.

Metrics/tracing infrastructure is platform-owned. Service Business provides meaningful operation names and context.

## 18. Testing Strategy

### Domain unit tests

Test at minimum:

- valid/invalid BusinessStatus
- locale validation
- timezone validation
- currency validation
- slug validation
- positive service duration
- Business invariants
- Service category ownership
- parent category same-business rule
- self-parent rejection
- service category requirement
- service slug uniqueness behavior
- inactive/archive behavior
- policy versioning rules
- immutable historical policy versions

### Application tests

Test:

- authenticated context requirement
- tenant/business isolation
- duplicate handling
- not-found behavior
- cross-business rejection
- atomic Business + Profile creation
- policy concurrency/version conflict

### Integration tests

Use PostgreSQL/Prisma against a real test database where practical.

Verify:

- unique constraints
- foreign keys
- indexes used by expected access patterns
- transaction rollback
- business isolation
- policy version uniqueness
- persistence mappings

### API tests

Verify:

- DTO validation
- stable error codes
- HTTP status mapping
- authorization boundary
- localized error message selection
- endpoint request/response contracts

## 19. Security Guardrails

- No credentials or session tables.
- No generic authorization engine.
- No client-controlled tenant escalation.
- Every business-scoped operation verifies scope.
- Object access must verify ownership/relationship/permission.
- Secrets stay out of source control and logs.
- External callbacks are out of Phase 1.
- Rate limiting belongs to the platform/API boundary; Phase 1 must not bypass it.

## 20. Definition of Done

Phase 1 is complete only when all of the following are true:

- NestJS application builds and starts.
- Prisma schema and migrations are reproducible.
- PostgreSQL persistence works.
- Business + initial Profile creation is atomic.
- Business, Location, Category, Service and Policy invariants are enforced.
- All repository ports have concrete adapters.
- Application use cases do not depend on Prisma directly.
- Domain code does not depend on NestJS, Prisma, provider SDKs, or HTTP DTOs.
- Business/tenant scope is mandatory for repository operations.
- API returns stable error codes.
- Tests cover domain, application, persistence, and HTTP boundaries.
- No external capability has been duplicated as local source of truth.
- No appointment/booking/payment/notification implementation has leaked into Phase 1.
- Structured observability hooks exist.
- Documentation remains consistent with the implementation.

## 21. Architecture Guardrails

The following are explicit implementation prohibitions:

1. Do not create `User`, `Person`, `Organization`, `Tenant`, `Membership`, `Permission`, `Reservation`, `Payment`, `Ledger`, `Resource`, or Notification-delivery tables in Phase 1.
2. Do not add provider SDK dependencies to domain code.
3. Do not make Service Business responsible for generic platform capabilities.
4. Do not create a `ServiceCatalog` aggregate/table/repository merely because the concept exists in product documentation.
5. Do not make `ServiceCategory` a child entity of `Service`.
6. Do not allow cross-business category, parent, service, location, or policy references.
7. Do not allow callers to choose their authorization or organization context.
8. Do not implement customer-specific branches or hard-coded customer branding.
9. Do not encode country, language, currency, timezone, or payment-provider assumptions into generic domain code.
10. Do not introduce appointment, reservation, availability, payment execution, or notification transport as a hidden dependency of Phase 1.

## 22. Implementation Order

Implementation should proceed in this order:

1. Repository/application scaffold and dependency direction.
2. Shared domain errors and request context contracts.
3. Value objects.
4. Business aggregate and BusinessProfile.
5. Business persistence and atomic creation transaction.
6. BusinessLocation.
7. ServiceCategory.
8. Service.
9. BusinessPolicy and optimistic versioning.
10. Application use cases.
11. REST controllers/DTOs.
12. Authorization/context integration adapters.
13. Observability/audit integration boundaries.
14. Unit tests.
15. Integration/API tests.
16. Architecture/documentation consistency audit.

No later step should silently expand the approved Phase 1 scope.

## 23. Final Architectural Principle

> Build Once. Configure Many Times.

A second business must be onboardable through configuration and platform contracts rather than a fork of Service Business domain code.

Service Business remains one reusable domain application inside SmartCore, not the owner of the entire platform.
