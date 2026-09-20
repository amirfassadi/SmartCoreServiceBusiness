# Phase 1 Implementation Specification

Document status: Final
Phase: 1
Scope: Service Business domain foundation only
Implementation status: Phase 1 backend implementation exists and is validated. This specification remains the architectural contract; current implementation details are reconciled below.

## 1. Authoritative Architecture References

The following repository documents are authoritative for this specification:

- README.md
- SmartCoreServiceBusiness-documentation-v1/ARCHITECTURE.md
- SmartCoreServiceBusiness-documentation-v1/DOMAIN_MODEL.md
- SmartCoreServiceBusiness-documentation-v1/DATA_MODEL.md
- SmartCoreServiceBusiness-documentation-v1/PLATFORM_MODULE_MAP.md
- SmartCoreServiceBusiness-documentation-v1/IDENTITY_INTEGRATION.md
- SmartCoreServiceBusiness-documentation-v1/TENANCY.md
- SmartCoreServiceBusiness-documentation-v1/SECURITY.md
- SmartCoreServiceBusiness-documentation-v1/BOOKING.md
- SmartCoreServiceBusiness-documentation-v1/PAYMENT.md
- SmartCoreServiceBusiness-documentation-v1/NOTIFICATION.md
- SmartCoreServiceBusiness-documentation-v1/PRODUCT.md

These documents take precedence over convenience-driven assumptions or implementation shortcuts.

## 2. Repository Inspection Summary

### 2.1 What is actually present in this repository

The repository contains a working Phase 1 backend for the Service Business bounded context, together with its Prisma persistence model, migrations, HTTP presentation layer, and tests.

Implemented in this repository:
- TypeScript/NestJS application source under `src/`
- Prisma schema and migrations under `prisma/`
- REST controllers, DTO validation, application use cases, domain entities, and Prisma repositories
- Unit and PostgreSQL integration tests under `test/`
- package and runtime configuration required by the backend

Not implemented here:
- frontend application
- Identity/authentication/session subsystem
- generic Authorization engine
- Customer, Staff, Resource, Availability, Booking/Reservation, Payment/Finance, Deposit, Notification, or SMS bounded contexts

Frontend status:
- Frontend code and repository structure are not started in this repository.
- The approved Frontend stack is target architecture only: TypeScript, Next.js App Router, React, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod, next-intl, and optional Zustand for genuine complex client state.
- Persian language support and RTL are required from the beginning.
- No OpenAPI contract or generated TypeScript API client currently exists.

### 2.2 Repository status

The current repository contains the implemented Phase 1 backend. Git history includes implementation commits for Business scope enforcement and Service/ServiceCategory lifecycle management.

### 2.3 Architecture vs implementation reality

The architecture remains authoritative for ownership and external boundaries. For current runtime behavior, the source code, Prisma schema, migrations, controllers, and tests are the implementation source of truth.

Therefore:
- implemented behavior is documented as current only when supported by source and tests
- Identity, Authorization, and future platform capabilities remain integration boundaries
- conceptual future workflows must not be read as implemented endpoints

### 2.4 Conflicts and precedence

Current source-code and documentation drift is possible because this specification originated before implementation. The ownership architecture takes precedence for boundaries; current source, schema, migrations, and tests take precedence for implemented behavior.

The governing rule is:
- module ownership comes from SmartCore architecture
- repository layout is secondary
- implementation must not absorb generic platform responsibilities

## 3. Phase 1 Architectural Boundary

### 3.1 In scope for Phase 1

Service Business owns the business-scoped meaning and policy for a service-oriented business.

Phase 1 includes:
- Business
- Business Profile
- Business Location
- Service Catalog
- Service
- Business Policy

These are the minimum concepts needed to prove:
- Service Business owns its own domain state
- business/tenant isolation exists
- domain invariants are enforceable
- repository and persistence contracts are correct
- external capabilities remain references, not owned duplicates

### 3.2 Explicitly out of scope for Phase 1

These must not be implemented in Phase 1:
- Appointment
- Booking
- Reservation execution
- Availability engine
- Payment execution
- Payment database
- Notification delivery
- Resource allocation
- Identity implementation
- Authentication/session implementation
- Organization/Tenancy implementation
- Authorization engine implementation
- customer/staff identity ownership

These capabilities belong to external SmartCore modules and must remain external contracts or references.

### 3.3 Purpose of Phase 1

Phase 1 is not a product feature slice; it is a foundational ownership proof.

It must validate:
- domain boundaries
- business isolation
- repository ports
- persistence boundary
- application layer separation
- API contract without domain leakage

## 4. External Ownership Rules

### 4.1 Identity

Identity owns:
- Person
- User
- authentication
- credentials
- sessions
- tokens
- identity lifecycle

Service Business must not implement people, login, credentials, or session management.

Service Business may hold only external references such as personId or userId when required by a business relationship.

### 4.2 Organization / Tenancy

Organization/Tenancy owns:
- organization data
- tenant boundaries
- membership context
- organization-scoped ownership

Service Business must not create its own organization or tenant tables.

The relationship between a business and its owning organization must be a reference, not a duplicated table.

### 4.3 Authorization

Authorization owns reusable permission decisions.

Service Business must never implement generic permission logic or duplicate permission tables.

Business-specific access policy is allowed only where it is a business rule scoped to Service Business, not a generic platform authorization engine.

### 4.4 Scheduling / Reservation

Scheduling and Reservation own:
- availability
- time-slot logic
- reservation state
- conflict prevention
- resource allocation semantics

Service Business must not duplicate these mechanisms.

Service Business may hold reservation references, not reservation ownership.

### 4.5 Resource

Resource owns:
- resource type
- resource instance
- allocation
- conflict handling

Service Business must not own resource tables or allocation logic.

### 4.6 Payment / Finance

Finance / Payment owns:
- payment session
- provider interaction
- settlement and refund semantics
- ledger and transaction state

Service Business may define business-owned payment requirement policy, but it must not implement payment execution, provider state, settlement/refund execution, ledger source-of-truth, or local payment snapshots in Phase 1.

The final Phase 1 rule is:
- payment requirement policy may be owned by Service Business
- payment requirement policy does not transfer payment execution, settlement, refund, ledger, or provider-state ownership to BusinessPolicy
- payment execution remains external
- payment provider interaction remains external
- settlement/refund remains external
- ledger/transaction source-of-truth remains external
- payment amount execution state and payment snapshots are not implemented as local payment models in Phase 1

### 4.7 Notification

Communication / Notification owns:
- delivery channel selection
- SMS / email / push providers
- delivery status and retries

Service Business may emit domain events, but not own notification transport.

## 5. Technology Baseline

### 5.1 Proposed Phase 1 technology baseline

The most reasonable implementation baseline is:
- TypeScript
- NestJS
- Prisma
- PostgreSQL
- Jest
- class-validator
- class-transformer
- REST API

This matches the existing SmartCore implementation style present in local workspace examples, especially the SmartCore IoT implementation convention found in SmartCoreIOT/package.json.

### 5.2 Important architectural note

This is an implementation convention only.
It does not redefine the technology-neutral SmartCore architecture.

The architecture remains the source of truth; the technology stack is only the chosen execution mechanism.

## 6. Domain Model

### 6.1 Business

Responsibility:
- the Service Business root aggregate
- business identity within Service Business
- maintains a reference to the owning organization/tenant
- owns locale, currency, and timezone defaults
- manages business-level configuration and policy scope

Suggested properties:
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
- deletedAt (optional if soft delete is required)

Lifecycle / status:
- draft
- active
- suspended
- archived

Creation is an application operation that creates a business in the draft state, not a BusinessStatus value.

Dependencies:
- Organization/Tenancy: external reference only
- Localization: locale support reference only
- Configuration: platform configuration, not owned by Service Business

### 6.2 Business Profile

Responsibility:
- business metadata
- name
- description
- logo / media reference
- contact information
- public-facing detail

Suggested properties:
- id
- businessId
- name
- description
- logoUrl
- contactEmail
- createdAt
- updatedAt

Lifecycle:
- created
- updated
- archived if necessary

Dependencies:
- Media capability may provide the actual asset, but not as local source-of-truth

### 6.3 Business Location

Responsibility:
- physical or logical business location
- address and timezone
- active/inactive state
- availability context for later Scheduling integration

Suggested properties:
- id
- businessId
- name
- address
- timezone
- active
- createdAt
- updatedAt

Lifecycle:
- active -> inactive
- add -> update -> archive

Dependencies:
- later Resource and Scheduling integration only

### 6.4 Service Catalog

Responsibility:
- organizes services within a business
- provides a business-scoped catalog boundary
- groups related services and categories without becoming a generic platform capability

The authoritative architecture does not require Service Catalog to be an independent top-level aggregate root. For Phase 1, the approved interpretation is:
- treat Service Catalog as a conceptual business boundary and repository grouping
- keep actual persistence ownership at the Business, ServiceCategory, and Service level
- do not create a separate ServiceCatalog aggregate, table, repository, or independent service boundary

This keeps the implementation aligned with the architecture while avoiding unnecessary aggregate proliferation.

### 6.5 Service

Responsibility:
- service definition for a business
- name / slug / duration / required category / archivedAt lifecycle state
- business-scoped catalog membership
- policy references that are owned by Service Business only

Suggested properties:
- id
- businessId
- categoryId
- name
- slug
- durationMinutes
- archivedAt
- createdAt
- updatedAt

Required relationship rule:
- Service requires a ServiceCategory reference
- categoryId is required for Phase 1
- categoryId is NOT NULL
- category ownership must match the Service business
- ServiceCategory is business-scoped and reusable by multiple services
- ServiceCategory is not a child entity of Service
- a Service cannot be created without a category

Important boundary rule:
- Service does not own a local payment model
- Service does not own reservation semantics
- Service does not own scheduling conflict logic
- Service may keep a lightweight external reference or policy key only when it is a Service Business-owned policy, not a Scheduling or Payment model

Service lifecycle:

- `archivedAt: null` means `ACTIVE`.
- A timestamp means `ARCHIVED`.
- Archived Services remain retrievable by ID but cannot be updated.
- GetById returns archived Services with HTTP 200.
- Updating an archived Service returns HTTP 409.
- Archive and restore are idempotent.
- List operations support `status=active`, `status=archived`, and `status=all`; the default is `status=active`.

### 6.6 Business Policy

Responsibility:
- store business-specific rules that are local to Service Business
- maintain policy versioning for local business decisions
- support later integration with external authorization or workflow systems

Examples of local policy that are genuinely owned by Service Business:
- business-specific cancellation rule for the business's own fulfilment process
- business-specific service confirmation rule that applies within the Service Business domain
- default business locale for communications

The examples above must remain local to Service Business and must not be used to absorb Scheduling/Reservation or Payment/Finance policy ownership.

Examples of external policy not owned here:
- generic authorization permissions
- payment execution rules
- scheduling conflict rules
- resource allocation policy

Important rule:
- BusinessPolicy is a child entity of Business for Phase 1, not a separate aggregate root.
- This resolves the previous ambiguity and keeps the ownership model aligned with the domain model.

Policy ownership must be separated clearly:
- Service Business: business policy
- Scheduling/Reservation: availability and reservation policy
- Payment/Finance: payment execution and refund policy
- Authorization: permission decisions

## 7. Aggregate Boundaries

### 7.1 Final aggregate decision

The authoritative architecture does not justify over-modeling Phase 1.

The correct Phase 1 aggregate structure is:
- Business as the core aggregate root
- BusinessProfile as a child entity of Business
- BusinessLocation as a child entity of Business
- BusinessPolicy as a child entity of Business
- ServiceCategory as a business-scoped catalog classification, not a child entity of Service
- Service as a business-scoped domain entity and aggregate root for the managed service definition

ServiceCatalog remains a conceptual catalog boundary and repository grouping, not a mandatory independent aggregate root and not a separate persistence model.

### 7.2 Aggregate root decision

Confirmed aggregate roots for Phase 1:
- Business
- Service

ServiceCatalog is a conceptual business boundary for organizing services and categories. It is not a required persisted aggregate root and is not a generic platform capability.

### 7.3 Child entities and value objects

Business aggregate children:
- BusinessProfile
- BusinessLocation
- BusinessPolicy

Business-scoped catalog entity:
- ServiceCategory
  - business-scoped catalog classification
  - not a child entity of Service
  - not a generic platform capability
  - belongs to the Service Business domain

Service model:
- business-scoped service definition
- requires a ServiceCategory reference
- category must belong to the same business
- a Service cannot be created without a category

Value objects:
- BusinessStatus
- Locale
- Timezone
- Currency
- Slug
- ServiceDuration

Use value objects only where validation and semantic clarity are real requirements.

## 8. Value Objects

### 8.1 BusinessStatus

Purpose:
- status of the business lifecycle

Valid values:
- draft
- active
- suspended
- archived

Invariants:
- status must be known canonical enum value
- archived businesses cannot be used for new active operations

### 8.2 Locale

Purpose:
- language and regional preference

Validation:
- must be valid ISO locale code or equivalent canonical locale contract
- must be in the business-supported locale list when used in business operations

### 8.3 Timezone

Purpose:
- canonical business timezone

Validation:
- must be a valid timezone identifier
- must be consistent with the business location if location-specific times are later added

### 8.4 Currency

Purpose:
- default currency for the business where required by business policy or price snapshots

Validation:
- must be a valid currency code
- should not be used as a payment execution model

### 8.5 Slug

Purpose:
- URL-safe, business-scoped identifier

Validation:
- lower-case
- ASCII-safe or configured canonical format
- unique within business ownership scope
- cannot contain whitespace or invalid path characters

### 8.6 ServiceDuration

Purpose:
- service duration semantics

Validation:
- positive integer minutes
- not zero or negative
- consistent with scheduling availability rules handled by external Scheduling capability later

## 9. Invariants

### 9.1 Domain invariants

Phase 1 domain invariants:
- business must belong to an organization/tenant reference
- business slug uniqueness must be enforced within ownership scope
- one profile per business
- location belongs to exactly one business
- location uniqueness within business
- service belongs to exactly one business
- service category belongs to the same business as the service
- categoryId is required and not nullable
- when parent_category_id is provided, the parent category must belong to the same business
- cross-business parent category references are rejected
- service slug uniqueness within business
- archived Services must not be treated as active catalog items
- policies must be versioned and unique by business and policy key
- cross-business references must be rejected at the domain boundary
- tenant/business isolation must be enforced at repository and service layers

### 9.2 Application validation

Application validation includes:
- DTO validation
- unauthorized access checks
- existence checks
- duplicate slug detection
- same-business enforcement before mutation
- parent category same-business validation when parent_category_id is provided
- categoryId required validation for Service creation

### 9.3 Database constraints

Database constraints should reflect the most important invariants:
- uniqueness on business slug within business ownership scope
- uniqueness on service slug within business
- uniqueness on business profile per business
- foreign key on businessId for associated entities
- indexes on businessId and lifecycle fields where filtering is required

## 10. External References

These are references and integration contracts, not local source-of-truth data:
- organizationId → Organization/Tenancy reference
- personId → Identity reference
- userId → Identity reference
- reservationId → Scheduling/Reservation reference
- paymentId → Finance/Payment reference
- resourceId → Resource reference
- actorId → external identity or authorization context

Service Business may store these references for operation and traceability, but it must not create duplicate local identity, organization, payment, reservation, or resource tables.

Customer/staff relationships may be modeled later as business-scoped relationship records, but they are not source-of-truth identity ownership and must not become a duplicate of the Identity capability.

## 11. Repository Ports

### 11.1 BusinessRepositoryPort

Responsibilities:
- create business and its initial BusinessProfile atomically
- get business by id with its BusinessProfile within ownership scope
- get business by slug within ownership scope
- update business data
- update the BusinessProfile for a business
- list businesses for owner/tenant scope
- read the BusinessProfile for a business

Input / output:
- input includes business aggregate or create command payload
- output returns business aggregate or persistence result

Error behavior:
- domain not found
- duplicate slug
- invalid ownership scope
- transaction failure

BusinessProfile does not have a separate repository port in Phase 1. It is a child entity of Business and is persisted and read through BusinessRepositoryPort. CreateBusiness MUST persist Business and its required initial BusinessProfile atomically through this port.

### 11.2 BusinessLocationRepositoryPort

This repository port exists as a separate port because BusinessLocation has its own persisted lifecycle while remaining a child entity of Business.

Responsibilities:
- create a location within a business
- get a location by id within business and organization scope
- list locations within a business
- update location data within business scope
- deactivate a location without deleting the record

Error behavior:
- LocationNotFound
- DuplicateLocationName
- CrossBusinessReference
- InvalidOwnerScope
- PersistenceFailure

### 11.3 ServiceCategoryRepositoryPort

This repository port exists as a separate port because ServiceCategory is persisted as a business-scoped catalog classification and is referenced by Service. It is not a ServiceCatalogRepository.

Responsibilities:
- create a category within a business
- get a category by id within business and organization scope
- list categories within a business
- validate a category and optional parent category belong to the same business
- detect duplicate category slugs within a business
- no category deactivation operation is included in Phase 1

Error behavior:
- CategoryNotFound
- DuplicateSlug
- CrossBusinessReference
- InvalidParentCategory
- InvalidOwnerScope
- PersistenceFailure

### 11.4 ServiceRepositoryPort

Responsibilities:
- create service
- update service
- archive service
- get service by id within business scope
- list services by business and explicit lifecycle status
- validate category ownership

Error behavior:
- service not found
- category mismatch
- cross-business reference violation
- duplicate slug

### 11.5 BusinessPolicyRepositoryPort

This repository port exists as a separate port because BusinessPolicy has versioned persisted records and a create/update lifecycle, while remaining a child entity of Business.

Responsibilities:
- create the first policy version for a business
- get the current version of a policy by business and policy key
- list policy versions within a business
- append a new version when a policy is updated
- validate policy ownership and policy-key uniqueness semantics

Error behavior:
- PolicyNotFound
- DuplicatePolicyKey
- InvalidPolicy
- CrossBusinessReference
- InvalidOwnerScope
- PersistenceFailure
- TransactionFailure

### 11.6 Repository boundary decision

The Phase 1 repository ports are deterministic:
- BusinessRepositoryPort exists and owns Business plus BusinessProfile persistence.
- BusinessLocationRepositoryPort exists and owns BusinessLocation persistence.
- ServiceCategoryRepositoryPort exists and owns ServiceCategory persistence.
- ServiceRepositoryPort exists and owns Service persistence.
- BusinessPolicyRepositoryPort exists and owns BusinessPolicy persistence.
- ServiceCatalogRepository does not exist. ServiceCatalog remains a conceptual boundary and repository grouping only; its persistence is represented by Business, ServiceCategory, and Service repositories.

### 11.7 Repository rule

The application layer must depend on repository ports, not Prisma directly.

## 12. Application Use Cases

### 12.1 CreateBusiness
Purpose:
- create a business and its initial business profile atomically in the Service Business domain

Input:
- slug
- defaultLocale
- supportedLocales
- timezone
- currency
- profileName
- profileDescription (optional)
- profileLogoUrl (optional)
- profileContactEmail (optional)

Output:
- Business aggregate result with its initial BusinessProfile

Validation:
- organization context is established externally by Organization/Tenancy
- organizationId is not client-controlled ownership input
- slug valid and unique within business scope
- currency and locale valid
- BusinessProfile creation is required in the same transaction as Business creation
- initial profile fields must be provided as part of the CreateBusiness command
- status is always initialized to draft; status is not accepted from the client

Repository calls:
- BusinessRepositoryPort.create

Application context contract:
- OrganizationContext contains organizationId and optionally actorId from the externally validated caller context
- the application layer receives the validated context, not arbitrary client-supplied ownership data

Transaction rule:
- CreateBusiness MUST create the Business and its initial BusinessProfile in a single atomic operation
- the BusinessRepositoryPort.create contract persists Business + initial BusinessProfile as one atomic application operation
- profile creation is not optional and is not left to a later API step

### 12.2 GetBusiness
Purpose:
- fetch business by id within scope

Validation:
- request must include business context and tenant validation

Repository calls:
- BusinessRepositoryPort.getById

### 12.3 UpdateBusinessProfile
Purpose:
- modify the business profile

Input:
- businessId
- name
- description
- logoUrl
- contactEmail

Validation:
- business exists
- caller is authorized for business scope
- one profile per business

Repository calls:
- BusinessRepositoryPort.getById
- BusinessRepositoryPort.updateProfile

### 12.4 AddBusinessLocation
Purpose:
- add a location to a business

Input:
- businessId from the route and validated OrganizationContext
- name
- address
- timezone

Validation:
- business must exist
- business scope must match
- location unique within business

Repository calls:
- BusinessRepositoryPort.getById
- BusinessLocationRepositoryPort.create

Dependencies:
- no local Resource implementation required yet

### 12.5 GetBusinessLocations
Purpose:
- read all locations belonging to a business within the validated ownership context

Validation:
- business and organization context must match

Repository calls:
- BusinessLocationRepositoryPort.listByBusiness

### 12.6 UpdateBusinessLocation
Purpose:
- update the name, address, or timezone of a business location

Input:
- businessId
- locationId
- name
- address
- timezone

Validation:
- location exists in the same business
- location name remains unique within the business
- caller is authorized for the business scope

Repository calls:
- BusinessLocationRepositoryPort.getById
- BusinessLocationRepositoryPort.update

### 12.7 DeactivateBusinessLocation
Purpose:
- deactivate a location without deleting its historical record

Validation:
- location exists in the same business
- caller is authorized for the business scope

Repository calls:
- BusinessLocationRepositoryPort.getById
- BusinessLocationRepositoryPort.deactivate

### 12.8 CreateServiceCategory
Purpose:
- create the business-scoped category required by Service creation

Input:
- businessId from the route and validated OrganizationContext
- name
- slug
- parentCategoryId (optional)

Output:
- created ServiceCategory

Validation:
- businessId is taken from the validated route/business context and is not a client-controlled ownership override
- name is required and non-blank
- slug is required, canonical, and unique within the business
- parentCategoryId, when provided, must reference an existing category in the same business
- parentCategoryId may be null for a top-level category
- a category cannot be its own parent
- no external module ownership or policy is accepted in the category payload

Repository calls:
- BusinessRepositoryPort.getById
- ServiceCategoryRepositoryPort.getById when parentCategoryId is provided
- ServiceCategoryRepositoryPort.create

Transaction rule:
- CreateServiceCategory MUST validate business ownership, validate the optional parent, and insert the category in one atomic repository operation or database transaction
- no distributed or cross-module transaction is permitted

### 12.9 CreateService
Purpose:
- create a service in the business catalog

Validation:
- category belongs to same business
- slug unique within business
- duration positive
- service is business-scoped

Repository calls:
- ServiceRepositoryPort.create
- BusinessRepositoryPort.getById
- validate ServiceCategory existence in the same business
- validate ServiceCategory belongs to the same business
- validate service slug uniqueness within the business

### 12.10 ArchiveService
Purpose:
- deactivate a service without deleting the record

Validation:
- service exists in same business
- cannot archive unrelated service

Output:
- archived service record

### 12.11 CreateBusinessPolicy
Purpose:
- create the first version of a local Service Business policy for a business

Input:
- businessId from the route and validated OrganizationContext
- policyKey
- policyValueJson

Output:
- created BusinessPolicy with version 1

Validation:
- businessId is taken from validated business context and is not client-controlled ownership input
- policyKey is required, non-blank, 1-100 characters, and uses canonical lower-case dot-separated ASCII segments
- policyKey is immutable after creation
- policyValueJson must be valid JSON, non-null, and contain only Service Business-owned policy data
- policyValueJson must not represent payment, scheduling, reservation, notification, resource, identity, tenancy, or authorization source-of-truth state
- the policy key must not already exist for the business

Repository calls:
- BusinessRepositoryPort.getById
- BusinessPolicyRepositoryPort.getCurrentByKey
- BusinessPolicyRepositoryPort.createVersion

Transaction rule:
- CreateBusinessPolicy MUST validate ownership and uniqueness and insert version 1 atomically

### 12.12 UpdateBusinessPolicy
Purpose:
- append a new version of an existing local Service Business policy

Input:
- businessId from the route and validated OrganizationContext
- policyKey from the route
- policyValueJson

Output:
- updated BusinessPolicy with the next version number

Validation:
- the policy exists in the same business
- policyKey is immutable and must match the route context
- policyValueJson follows the CreateBusinessPolicy rules
- version is not client-supplied

Version and uniqueness semantics:
- CreateBusinessPolicy always creates version 1
- UpdateBusinessPolicy reads the current version and appends current version + 1
- previous versions are immutable and remain queryable
- uniqueness is enforced by (businessId, policyKey, version)
- only one current version exists for a given (businessId, policyKey); the highest version is current

Repository calls:
- BusinessPolicyRepositoryPort.getCurrentByKey
- BusinessPolicyRepositoryPort.appendVersion

Transaction rule:
- UpdateBusinessPolicy MUST read the current version and append the next version in one transaction with concurrency protection; a conflicting concurrent update returns TransactionFailure or DatabaseConstraintViolation

### 12.13 Deferred use cases
Not included in Phase 1:
- appointment creation
- payment session creation
- reservation creation
- notification dispatch
- staff/customer relationship management

## 13. Database Model

Phase 1 should own only Service Business-owned tables.

### 13.1 businesses
Purpose:
- root business record
Ownership:
- Service Business owned
Tenant/business scope:
- organization_id from the externally established Organization/Tenancy context
Columns:
- id UUID PK
- organization_id UUID (external reference; not client-supplied ownership input)
- slug VARCHAR
- default_locale VARCHAR
- supported_locales JSON
- timezone VARCHAR
- currency VARCHAR
- status VARCHAR
- created_at TIMESTAMP
- updated_at TIMESTAMP
- deleted_at TIMESTAMP NULL
Constraints:
- unique (organization_id, slug)
Indexes:
- organization_id
- status

### 13.2 business_profiles
Purpose:
- metadata and public profile for a business
Ownership:
- Service Business owned
Columns:
- id UUID PK
- business_id UUID FK -> businesses.id
- name VARCHAR NOT NULL
- description TEXT NULL
- logo_url VARCHAR NULL
- contact_email VARCHAR NULL
- created_at TIMESTAMP
- updated_at TIMESTAMP
Constraints:
- unique (business_id)
Indexes:
- business_id

CreateBusiness persists Business + initial BusinessProfile in one atomic application operation. The repository layer may implement this through a transactional repository method or equivalent transaction boundary, but the persistence contract remains a single atomic CreateBusiness operation.

### 13.3 business_locations
Purpose:
- physical/logical location belonging to a business
Columns:
- id UUID PK
- business_id UUID FK -> businesses.id
- name VARCHAR
- address TEXT
- timezone VARCHAR
- active BOOLEAN
- created_at TIMESTAMP
- updated_at TIMESTAMP
Constraints:
- unique (business_id, name)
Indexes:
- business_id
- active

### 13.4 service_categories
Purpose:
- service grouping and catalog organization within a business
Columns:
- id UUID PK
- business_id UUID FK -> businesses.id
- name VARCHAR
- slug VARCHAR
- parent_category_id UUID NULL FK -> service_categories.id
- archived_at TIMESTAMP NULL
- created_at TIMESTAMP
- updated_at TIMESTAMP
Constraints:
- unique (business_id, slug)
Indexes:
- business_id
- parent_category_id
- archived_at

ServiceCategory lifecycle:
- `archivedAt: null` means `ACTIVE`.
- A timestamp means `ARCHIVED`.
- Archived categories remain retrievable by ID with HTTP 200 but cannot be updated; update returns HTTP 409.
- Archive and restore are idempotent.
- Category archive returns HTTP 409 while the category contains one or more active Services.
- Category lists support `status=active`, `status=archived`, and `status=all`; the default is `status=active`.

### 13.5 services
Purpose:
- service definition in business catalog
Columns:
- id UUID PK
- business_id UUID FK -> businesses.id
- category_id UUID NOT NULL FK -> service_categories.id
- name VARCHAR
- slug VARCHAR
- duration_minutes INT
- archived_at TIMESTAMP NULL
- created_at TIMESTAMP
- updated_at TIMESTAMP
- deleted_at TIMESTAMP NULL
Constraints:
- unique (business_id, slug)
- category_id is required and NOT NULL
- category must belong to same business
- a Service cannot be created without a category
Indexes:
- business_id
- category_id
- archived_at

Service lifecycle persistence:
- `archivedAt: null` means `ACTIVE`.
- A timestamp means `ARCHIVED`.
- `deletedAt` remains independent and is not changed by archive or restore.

Important boundary rule:
- no local booking policy JSON field in Phase 1
- no local price snapshot model in Phase 1
- no payment execution fields in Phase 1
- any scheduling/payment information must be represented as external references or boundary contracts only

### 13.6 business_policies
Purpose:
- local business-specific policy values
Columns:
- id UUID PK
- business_id UUID FK -> businesses.id
- policy_key VARCHAR
- policy_value_json JSON
- version INT
- created_at TIMESTAMP
- updated_at TIMESTAMP
Constraints:
- unique (business_id, policy_key, version)
- policy_key is immutable
- versions are positive integers beginning at 1
- the highest version for a business and policy key is the current version
Indexes:
- business_id
- policy_key

### 13.7 Disallowed tables in Phase 1

Do not create local tables for:
- organizations
- persons
- users
- auth tables
- sessions
- payment records
- reservation records
- resource records
- notifications
- appointments
- bookings

### 13.8 JSON policy fields

JSON fields are justified only when they represent Service Business-owned policy data.

They must not be used to duplicate external payment, reservation, resource, or authorization logic.

## 14. Prisma Design

Prisma should model only Service Business-owned entities.

Key design principles:
- only Service Business aggregates are in schema
- organizationId is a foreign reference field, not a duplicated linked table
- businessId is required on all child entities
- unique constraints enforce slug and profile uniqueness
- indexes on businessId and lifecycle fields where filtering is required
- soft delete used only if business history requires it
- migrations limited to Service Business-owned data only

### 14.1 Relation boundaries

Business has one profile.
Business has many locations.
Business has many service categories.
Business has many services.
Business has many policies.
ServiceCategory belongs to a business and may be referenced by many services.
Service requires a ServiceCategory reference and must belong to the same business.
When parent_category_id is provided, the parent category must belong to the same business.

### 14.2 Transaction boundaries

Transactions are required for:
- create business + initial BusinessProfile atomically as one CreateBusiness operation
- create ServiceCategory and validate optional parent ownership
- create service and validate required category ownership
- archive service
- create BusinessPolicy version 1
- update BusinessPolicy by appending the next version

Do not create distributed cross-module transactions with unrelated capabilities.

## 15. REST API Contract

Phase 1 API should be minimal and controlled.

### 15.1 POST /businesses
Purpose:
- create a new business and its initial profile atomically
Request body:
- slug
- defaultLocale
- supportedLocales
- timezone
- currency
- profileName
- profileDescription (optional)
- profileLogoUrl (optional)
- profileContactEmail (optional)
Response:
- created business object including the initial profile
Validation:
- organization context is established externally by Organization/Tenancy
- organizationId is not accepted as a client-controlled request field
- the application layer receives validated OrganizationContext
- slug valid and unique within the validated organization scope
- locale/currency valid
- initial profile creation is required as part of the same business creation flow
- business status is initialized to draft and is not accepted in the request body
Error cases:
- duplicate slug
- invalid tenant context
- invalid locale/currency
- attempted ownership override via request body

Conceptual application contract:
- OrganizationContext { organizationId: string; actorId?: string }
- the repository and domain layer operate only on the validated OrganizationContext, never on arbitrary client-supplied organizationId input

### 15.2 GET /businesses/:id
Purpose:
- fetch a business and its profile
Validation:
- must be scoped to caller context

### 15.3 PATCH /businesses/:id/profile
Purpose:
- update profile metadata
Validation:
- only same business scope
- one profile per business

### 15.4 POST /businesses/:id/locations
Purpose:
- add a business location
Validation:
- same business only
- unique location name within business

### 15.5 GET /businesses/:id/locations
Purpose:
- read the business locations
Validation:
- same business and organization scope only

### 15.6 PATCH /businesses/:id/locations/:locationId
Purpose:
- update a business location
Request body:
- name
- address
- timezone
Validation:
- location belongs to the business
- name remains unique within the business

### 15.7 POST /businesses/:id/locations/:locationId/deactivate
Purpose:
- deactivate a business location without deleting its record
Validation:
- location belongs to the business

### 15.8 POST /businesses/:id/service-categories
Purpose:
- create a business-scoped ServiceCategory for use by services
Request body:
- name
- slug
- parentCategoryId (optional; null creates a top-level category)
Validation:
- business id is taken from the validated route and organization context
- name is required and non-blank
- slug is required, canonical, and unique within the business
- parentCategoryId, when provided, must reference a category in the same business
- self-parenting is rejected
Error cases:
- invalid tenant or business context
- duplicate slug
- category not found
- invalid parent category
- cross-business reference

### 15.9 POST /businesses/:id/services
Purpose:
- create a service in the business catalog
Validation:
- service belongs to same business
- category belongs to same business
- slug unique in business
- duration positive

### 15.10 POST /businesses/:id/services/:serviceId/archive
Purpose:
- archive a service
Validation:
- same business
- service exists

### 15.11 POST /businesses/:id/policies
Purpose:
- create the first version of a local Service Business policy
Request body:
- policyKey
- policyValueJson
Validation:
- policyKey is required, canonical lower-case dot-separated ASCII, and 1-100 characters
- policyValueJson is required, valid JSON, and limited to Service Business-owned semantics
- policyKey must not already exist for the business
- business ownership comes from validated context, not the request body
Response:
- created BusinessPolicy with version 1

### 15.12 PATCH /businesses/:id/policies/:policyKey
Purpose:
- append a new version of an existing local Service Business policy
Request body:
- policyValueJson
Validation:
- policy exists in the same business
- policyKey is immutable and comes from the route
- policyValueJson follows the create-policy rules
- version is assigned by the application and is not client-controlled
Response:
- updated BusinessPolicy with the next version

### 15.13 GET /businesses/:id/policies/:policyKey/versions
Purpose:
- read the immutable versions of a local Service Business policy
Validation:
- policy belongs to the business and validated organization context

### 15.14 Authentication / authorization boundary

Authentication and authorization are external concerns.

Phase 1 APIs must accept that:
- caller identity is resolved by Identity
- authorization decisions come from Authorization
- tenant/business context is provided by external context or policy

The API layer does not implement those capabilities locally.

## 16. Error Model

Phase 1 should use a dedicated domain/application error model.

### 16.1 Domain errors
- BusinessNotFound
- LocationNotFound
- DuplicateLocationName
- ServiceNotFound
- CategoryNotFound
- InvalidParentCategory
- InvalidBusinessState
- DuplicateSlug
- DuplicatePolicyKey
- CrossBusinessReference
- InvalidPolicy
- InvalidServiceDuration

### 16.2 Application errors
- UnauthorizedBusinessAccess
- InvalidOwnerScope
- MissingBusinessContext
- PolicyNotFound

### 16.3 Infrastructure errors
- PersistenceFailure
- DatabaseConstraintViolation
- TransactionFailure

### 16.4 HTTP mapping
- 400 validation error
- 401 unauthenticated
- 403 unauthorized
- 404 not found
- 409 duplicate / conflict
- 422 business/domain validation
- 500 provider/system failure

## 17. Security and Tenant Isolation

The most critical rule for Service Business is strict tenant/business isolation.

### 17.1 Requirement

A request must never be allowed to access or mutate another tenant/business's data merely by supplying another ID.

### 17.2 Isolation model

- Organization/Tenancy establishes the tenant context outside this service
- business context must be validated before each repository call
- organizationId is not accepted from untrusted client payloads
- the application layer receives the validated OrganizationContext
- repository methods must filter by businessId and organizationId from the validated context
- application use cases must reject mismatched ownership
- database constraints enforce the same boundary where possible

### 17.3 Authorization boundary

Service Business does not implement an authorization engine.

It relies on:
- Identity for who the actor is
- Authorization for what the actor may do
- Organization/Tenancy for the owner context

## 18. Dependency Rules

### 18.1 Domain layer

Domain must not depend on:
- NestJS
- Prisma
- HTTP
- PostgreSQL SDK
- external provider SDK
- framework annotations

### 18.2 Application layer

Application must depend on:
- domain model
- repository ports
- use-case orchestration

Application must not depend directly on:
- Prisma
- database SDK
- HTTP layer

### 18.3 Infrastructure layer

Infrastructure must:
- implement repository ports
- handle Prisma access
- adapt external interfaces

### 18.4 Interfaces layer

Interfaces must:
- accept HTTP requests
- map DTOs to application commands
- return DTOs or errors
- not contain domain logic

## 19. Proposed Repository Structure

The repository structure should follow the existing SmartCore conventions already visible in the workspace and the layered architecture described in the docs.

Recommended initial shape:

src/
  domain/
    business/
      entities/
      value-objects/
      policies/
      events/
    services/
      entities/
      value-objects/
  application/
    business/
      commands/
      queries/
      services/
    services/
      commands/
      queries/
      services/
    ports/
      business-repository.port.ts
      service-repository.port.ts
  infrastructure/
    persistence/
      prisma/
        prisma.service.ts
        business.repository.ts
        service.repository.ts
    adapters/
      identity/
      tenancy/
      authorization/
  interfaces/
    http/
      controllers/
      dto/
  shared/
    errors/
    value-objects/
    result/
    ids/

test/
  unit/
  integration/

This structure is a conservative implementation convention and should be adapted only when a stronger repository convention already exists in the wider SmartCore workspace.

## 20. Testing Strategy

### 20.1 Domain unit tests

Test:
- business slug uniqueness
- business profile uniqueness
- location ownership and same-business constraint
- location read, update, and deactivation lifecycle
- service category belongs to same business
- category creation with top-level and same-business parent categories
- category duplicate slug and cross-business parent rejection
- service slug uniqueness within business
- policy versioning and uniqueness
- policy key and JSON policy-value validation
- policy create and update version sequencing
- inactive/archived service cannot be treated as active

### 20.2 Application tests

Test:
- create business use case
- update profile use case
- add location use case
- get, update, and deactivate location use cases
- create service category use case
- create service use case
- archive service use case
- create business policy use case
- update business policy use case
- cross-business invalid reference rejection

### 20.3 Integration tests

Test:
- Prisma persistence for all Service Business-owned records
- tenant/business isolation at repository level
- DB unique constraints
- API contract behavior for all documented HTTP use cases
- atomic Business plus initial BusinessProfile creation
- atomic category creation with optional parent validation
- atomic policy version append under concurrent update attempts

### 20.4 Deferred tests

Do not add tests for:
- appointment lifecycle
- payment flow
- reservation conflict logic
- notification delivery
- availability engine

## 21. Observability

Phase 1 should include only minimal observability:
- structured logs for business and service operations
- correlation ID
- businessId
- organizationId or tenant context reference where available
- operation name
- error category

Not required yet:
- event bus infrastructure
- large telemetry stack
- distributed tracing beyond simple correlation IDs

## 22. Domain Events

Phase 1 may include a limited event such as:
- BusinessCreated

If included:
- it belongs to Service Business domain ownership
- event payload should include businessId and context metadata
- event publication boundary is separate from notification delivery infrastructure

Do not add a broad event-driven infrastructure before the domain model is proven.

## 23. Explicit Non-Goals

Phase 1 must not include:
- appointment creation
- booking
- reservation execution
- availability calculation
- resource allocation
- payment sessions
- payment records
- notification delivery
- customer identity implementation
- staff identity implementation
- authentication/session implementation
- organization management
- authorization engine
- generic platform monolith behavior

These are intentionally deferred until later phases and later capability modules.

## 24. Implementation Sequence

1. Domain model definition
   - Business
   - BusinessProfile
   - BusinessLocation
   - ServiceCategory
   - Service
   - BusinessPolicy
   - conceptual ServiceCatalog boundary only
2. Value objects and invariants
3. Repository ports
4. Prisma schema for owned tables only
5. Database migration
6. Application use cases
7. REST DTOs and API contract
8. Validation and error mapping
9. Unit and integration tests
10. Minimal observability

Each step depends on previously established boundaries and no step may reintroduce generic platform ownership.

## 25. Definition of Done

Phase 1 is complete only if all of the following are true:
- Business has a defined CreateBusiness, GetBusiness, and status lifecycle beginning at draft and following exactly draft -> active -> suspended -> archived.
- CreateBusiness atomically creates Business and the required initial BusinessProfile; BusinessProfile.name is required.
- BusinessProfile has a defined creation lifecycle through CreateBusiness and a defined update/read lifecycle through BusinessRepositoryPort and the documented REST endpoints.
- BusinessLocation has defined create, read, update, and deactivation lifecycles through BusinessLocationRepositoryPort and the documented REST endpoints.
- ServiceCategory has an explicit CreateServiceCategory mechanism, including top-level and same-business parent creation paths.
- Service has an explicit CreateService and ArchiveService lifecycle with a required same-business ServiceCategory reference.
- BusinessPolicy has explicit CreateBusinessPolicy and UpdateBusinessPolicy lifecycles with immutable historical versions and deterministic version sequencing.
- ServiceCatalog is represented only as a conceptual business catalog boundary and repository grouping; no ServiceCatalog aggregate, table, repository, or independent service boundary exists.
- ownership is explicit: Service Business owns Business, BusinessProfile, BusinessLocation, ServiceCategory, Service, and local BusinessPolicy semantics; Organization/Tenancy supplies validated organization context externally.
- validation and invariants explicitly reject duplicate slugs, duplicate policy keys, invalid JSON policy values, invalid parent categories, cross-business references, invalid ownership, and invalid lifecycle state.
- BusinessRepositoryPort, BusinessLocationRepositoryPort, ServiceCategoryRepositoryPort, ServiceRepositoryPort, and BusinessPolicyRepositoryPort have deterministic responsibilities; BusinessProfile is persisted through BusinessRepositoryPort; ServiceCatalogRepository does not exist.
- REST contracts exist for every documented HTTP use case: business creation/read, profile update, location create/read/update/deactivate, category creation, service creation/archive, and policy create/update/version read.
- transactions are explicit and implemented for CreateBusiness, CreateServiceCategory, CreateService, ArchiveService, CreateBusinessPolicy, and UpdateBusinessPolicy as documented.
- Prisma implementation exists behind infrastructure
- PostgreSQL migration creates only owned tables
- tests prove the documented lifecycle operations, repository contracts, transaction boundaries, and major invariants.
- domain layer has no framework or database dependency
- API layer does not contain domain logic
- Identity, Organization/Tenancy, Payment, Reservation, Resource, and Notification remain external references or contracts
- no duplicate identity, auth, payment, reservation, or resource tables exist
- deferred capabilities remain deferred

## 26. Architecture Compliance Checklist

| Rule | Status | Evidence / Notes |
| --- | --- | --- |
| Service Business owns business semantics | Defined | README.md and DOMAIN_MODEL.md state business ownership |
| Identity remains external | Required | IDENTITY_INTEGRATION.md explicitly states the rule |
| Organization/Tenancy remains external | Required | TENANCY.md states external ownership boundary |
| Reservation remains external | Required | BOOKING.md defines Scheduling/Reservation ownership |
| Payment remains external | Required | PAYMENT.md defines Finance/Payment ownership |
| Notification remains external | Required | NOTIFICATION.md defines communication ownership |
| Authorization remains external | Required | SECURITY.md and module map define authorization ownership |
| Business profile and business location are in scope | Required | DOMAIN_MODEL.md defines them |
| Service catalog and service are in scope | Required | DOMAIN_MODEL.md defines them |
| Appointment and booking are deferred | Deferred | Architecture documents clearly separate them |
| Business/tenant isolation is required | Required | TENANCY.md and SECURITY.md define it |
| Repository ports are required | Required | architecture requires dependency inversion |
| Domain independent from infrastructure | Required | architecture specifies separation of concerns |
| API layer must not own business logic | Required | architecture specifies layers and dependency direction |
| Technology choice is implementation convention only | Defined | documentation is technology-neutral |
| This task remains documentation only | Required | current task explicitly forbids implementation |

## Architecture Decisions Confirmed for Implementation

The following decisions are confirmed and implementation may begin without further architecture approval:

1. organizationId is the canonical external ownership reference for Phase 1.
2. Organization/Tenancy remains externally owned.
3. Service Business owns only business-domain state.
4. Business is the core aggregate root.
5. BusinessProfile, BusinessLocation, and BusinessPolicy are Business child entities.
6. Service is a business-scoped domain entity and aggregate root as defined by the finalized model.
7. ServiceCatalog is a conceptual catalog boundary, not a required independent aggregate root.
8. ServiceCategory is a business-scoped catalog classification and is not a child entity of Service.
9. Phase 1 excludes appointment, booking, reservation execution, availability, payment execution, notification delivery, and resource allocation.
10. TypeScript + NestJS + Prisma + PostgreSQL + Jest is the implementation baseline.
11. Repository ports and application use cases must remain between domain and persistence.
12. No duplicate Identity, Organization/Tenancy, Payment, Reservation, Resource, or Notification source-of-truth tables may be created.

These decisions are final and must be treated as the implementation contract for Phase 1.

# Internal Architecture Consistency Review

This section records an internal consistency review of the repository's authoritative architecture documents and this specification. It is not an independent, external, or third-party audit.

### 1. Confirmed decisions from the repository/specification review
- Service Business owns only business-domain state and business-specific policy within its own domain boundary.
- Identity remains the source of truth for person, user, authentication, and session state.
- Organization/Tenancy remains the source of truth for organization and tenant boundaries.
- Authorization remains external and is not implemented in Service Business.
- Scheduling and Reservation remain external and are not implemented in Service Business.
- Payment and Finance remain external and are not implemented in Service Business.
- Resource remains external and is not implemented in Service Business.
- Notification remains external and is not implemented in Service Business.
- Business is the core aggregate root for the Service Business domain.
- BusinessProfile, BusinessLocation, and BusinessPolicy are Business child entities.
- Service is the business-scoped service definition and aggregate root for the managed catalog item.
- ServiceCatalog is a conceptual catalog boundary and repository grouping; it is not a required independent aggregate root.
- ServiceCategory is a business-scoped catalog classification and is not a child entity of Service.
- organizationId is the canonical external ownership reference for Phase 1 and is not client-controlled ownership input.
- Phase 1 excludes appointment, booking, reservation execution, availability, payment execution, notification delivery, and resource allocation.
- TypeScript + NestJS + Prisma + PostgreSQL + Jest is the implementation baseline.
- Repository ports and application use cases remain between the domain and persistence layers.
- No duplicate Identity, Organization/Tenancy, Payment, Reservation, Resource, or Notification source-of-truth tables may be created.

### 2. Resolved contradictions found during the repository/specification review
#### Contradiction 1: BusinessPolicy as child versus separate aggregate
- Previous ambiguity: the document described BusinessPolicy as both a child of Business and a potential separate aggregate root.
- Authoritative architectural interpretation: the documented architecture defines Service Business as a business-domain capability with local business policy, not a generic platform policy engine.
- Final decision: BusinessPolicy is a child entity of Business for Phase 1.
- Implementation consequence: only Service Business-owned policy data is created; no separate authorization, payment, or generic policy engine is introduced.

#### Contradiction 2: ServiceCatalog as required aggregate root versus conceptual boundary
- Previous ambiguity: the document described ServiceCatalog as both a persisted aggregate root and a business catalog grouping.
- Authoritative architectural interpretation: the architecture defines a business-scoped catalog boundary and service definitions, but does not mandate a separate root aggregate for ServiceCatalog.
- Final decision: ServiceCatalog is a conceptual catalog boundary and repository grouping, not a mandatory independent aggregate root.
- Implementation consequence: ServiceCatalog remains conceptual only; no ServiceCatalog table, repository, aggregate, or independent service boundary is created.

#### Contradiction 3: ServiceCategory relationship to Service
- Previous ambiguity: the specification described ServiceCategory as a child or grouping under Service while also modeling a categoryId on Service.
- Authoritative architectural interpretation: service categories belong to the business catalog boundary and multiple services may reference the same category; category ownership is business-scoped, not service-scoped.
- Final decision: ServiceCategory is a business-scoped catalog classification and is not a child entity of Service.
- Implementation consequence: Service contains categoryId, but category ownership remains aligned to the business scope and is validated against the same business.

#### Contradiction 4: organizationId trusted from request body
- Previous ambiguity: the earlier request contract allowed organizationId to be supplied in the client request body.
- Authoritative architectural interpretation: Organization/Tenancy establishes tenant context externally and the domain must not trust arbitrary client ownership input.
- Final decision: organizationId is supplied through the validated OrganizationContext from the external ownership layer; it is not client-controlled in the API request body.
- Implementation consequence: the application and repository layers rely on validated context and reject ownership override attempts.

#### Contradiction 5: open questions versus implementation readiness
- Previous ambiguity: the document contained unresolved open questions and a pre-coding approval gate alongside final readiness statements.
- Authoritative architectural interpretation: the architecture audit resolved the contradictions and confirmed the Phase 1 ownership boundaries.
- Final decision: the implementation contract is final and implementation may begin.
- Implementation consequence: the spec contains no pending architecture approval gate and no unresolved decision list.

#### Contradiction 6: policy versioning and ownership confusion
- Previous ambiguity: the document raised policy versioning without enforcing that it should be limited to local BusinessPolicy data.
- Authoritative architectural interpretation: only Service Business-owned rules may be stored locally; payment, scheduling, and authorization policies remain external.
- Final decision: BusinessPolicy versioning applies only to local Service Business policy data.
- Implementation consequence: JSON policy fields are used only for Service Business-owned policy and not for external capability logic.

#### Contradiction 7: payment and scheduling fields inside Service
- Previous ambiguity: earlier versions risked duplicating payment and scheduling semantics inside the Service model.
- Authoritative architectural interpretation: Payment, Scheduling, and Reservation functions are owned by external modules.
- Final decision: Service is kept as a business-domain service definition and does not include booking policy, price execution, or scheduling ownership fields.
- Implementation consequence: the model remains limited to local Service Business domain semantics.

### 3. Remaining open questions
None.

### 4. Current implementation status after the repository/specification review
IMPLEMENTED AND VALIDATED for the current Phase 1 backend scope. The architectural decisions above remain the boundary contract; the current source, Prisma schema, migrations, controllers, and tests are the runtime source of truth.

### Final reporting summary
- files inspected during the internal repository/specification review: README.md; SmartCoreServiceBusiness-documentation-v1/ARCHITECTURE.md; SmartCoreServiceBusiness-documentation-v1/DOMAIN_MODEL.md; SmartCoreServiceBusiness-documentation-v1/DATA_MODEL.md; SmartCoreServiceBusiness-documentation-v1/PLATFORM_MODULE_MAP.md; SmartCoreServiceBusiness-documentation-v1/IDENTITY_INTEGRATION.md; SmartCoreServiceBusiness-documentation-v1/TENANCY.md; SmartCoreServiceBusiness-documentation-v1/SECURITY.md; SmartCoreServiceBusiness-documentation-v1/BOOKING.md; SmartCoreServiceBusiness-documentation-v1/PAYMENT.md; SmartCoreServiceBusiness-documentation-v1/NOTIFICATION.md; SmartCoreServiceBusiness-documentation-v1/PRODUCT.md; SmartCoreIOT/package.json
- current implementation files: `src/`, `prisma/`, and `test/`; documentation is reconciled separately
- contradictions found: BusinessPolicy ownership ambiguity; ServiceCatalog aggregate ambiguity; ServiceCategory relationship ambiguity; organizationId ownership ambiguity; open-questions versus readiness contradiction; scheduling/payment duplication risk inside Service
- contradictions resolved: BusinessPolicy retained as a Business child; ServiceCatalog retained as a conceptual boundary; ServiceCategory fixed as a business-scoped catalog classification; organizationId restricted to externally validated context; implementation readiness clarified as final; external capability duplication removed from Service model
- remaining open questions: None
- final current status: Phase 1 backend implemented; deferred external boundaries remain outside this repository
