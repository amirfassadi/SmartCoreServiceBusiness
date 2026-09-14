# Product Definition

## 1. Product

SmartCoreServiceBusiness is a reusable application for businesses whose primary operation is delivering services to customers.

## 2. Target Problems

The product solves:

- service catalog management
- customer/business relationships
- staff assignment
- business locations
- availability
- appointments
- deposits and payments
- customer communication
- business policies
- multi-business operation
- multilingual customer/admin experiences

## 3. Product Model

A deployment consists of:

```text
SmartCore Platform
        ↓
Service Business
        ↓
Business Configuration
        ↓
Business-specific deployment
```

The core product remains generic.

## 4. Actors

Actors are identified by Identity and acquire business-specific relationships through the business domain.

Typical relationships:

- Customer
- Staff
- Manager
- Owner

One person may have several simultaneously.

## 5. Main User Journeys

### Customer

1. Register/login
2. Select business
3. Browse services
4. Select location
5. Select staff/resource preference
6. View availability
7. Create appointment
8. Pay deposit if required
9. Receive confirmation
10. Receive reminders
11. Complete/cancel appointment

### Staff

1. Authenticate
2. Enter business context
3. View assigned work
4. Manage availability where permitted
5. View appointments
6. Complete/no-show appointments

### Manager/Owner

1. Configure business
2. Manage services
3. Manage staff
4. Manage locations/resources
5. Configure hours/policies
6. Monitor appointments
7. Review financial results through Finance
8. Manage localization/content

## 6. Business Policies

Examples:

- cancellation window
- deposit requirement
- late cancellation fee
- no-show policy
- booking horizon
- maximum concurrent appointments
- staff assignment rules
- resource requirements

Policies belong to Service Business, while generic execution belongs to reusable modules.

## 7. Non-Goals

The core product is not:

- a payment gateway
- an accounting system
- an SMS provider
- an identity provider
- a calendar provider
- a storage provider
- a generic workflow engine

It integrates with those capabilities.

## 8. Commercial Model

The architecture supports:

- hosted SaaS
- dedicated customer deployment
- self-hosted deployment
- customer-owned database
- shared infrastructure with logical tenant isolation
- future white-label deployments

## 9. Build Once, Configure Many

A new customer should normally require configuration rather than source-code modification.

Configuration can define:

- branding
- supported locales
- currency
- timezone
- services
- categories
- locations
- business hours
- policies
- payment providers
- communication providers
- feature flags
