# MVP

## 1. Goal

Deliver a generic service-business application that can support the first real deployment without embedding customer-specific assumptions.

## 2. MVP Scope

### Foundation

- Identity integration
- organization/business context
- authorization
- configuration
- localization
- audit

### Business

- business profile
- service categories
- services
- staff
- customers
- locations
- policies

### Booking

- availability
- reservation
- appointment creation
- confirmation
- cancellation
- completion
- no-show

### Finance

- deposit requirement
- payment initiation
- payment verification
- provider abstraction
- refund contract

### Communication

- appointment confirmation
- cancellation
- reminder
- localized templates

## 3. Out of MVP

- loyalty
- referral
- marketplace
- complex subscriptions
- gift cards
- advanced analytics
- advanced workflow designer
- multi-provider marketplace

These can be integrated later without redesigning the core.

## 4. Acceptance Criteria

- a person can register/login through Identity
- a person can have multiple relationships in a business
- a business can configure supported locales
- service content can be localized
- availability is calculated with business/staff/resource constraints
- appointment conflicts are prevented
- deposit payment is provider-neutral
- successful payment can confirm an appointment
- callbacks are idempotent
- notifications are asynchronous
- tenant isolation is enforced
- customer-specific branding is configuration-only
- customer-specific payment provider is configuration-only
- no generic repository code references a real customer

## 5. MVP Architecture Test

A second customer must be deployable without modifying domain code merely to rename the business, change services, language, payment provider, or branding.
