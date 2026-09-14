# Roadmap

## Phase 0 — Architecture Baseline

- finalize `PLATFORM_MODULE_MAP.md`
- finalize contracts
- reconcile platform taxonomy with existing SmartCore documents
- define repository boundaries
- define API conventions

## Phase 1 — Foundation

- Identity integration
- Organization/Tenancy
- Authorization
- Configuration
- Localization
- Audit

## Phase 2 — Service Business Core

- Business
- Customer relationship
- Staff relationship
- Service catalog
- Locations
- policies

## Phase 3 — Scheduling and Reservation

- calendar
- availability
- working hours
- overrides
- blocked periods
- reservation
- resource allocation

## Phase 4 — Finance

- payment abstraction
- provider adapters
- deposit
- verification
- refund
- settlement contracts

## Phase 5 — Communication

- templates
- localization
- notification preferences
- SMS/email/push adapters
- retries

## Phase 6 — Workflow

- lifecycle orchestration
- reminders
- automation
- scheduled actions

## Phase 7 — Commerce

- products
- packages
- gift cards
- promotions
- orders

## Phase 8 — Subscription/Membership

- plans
- memberships
- entitlements
- renewals

## Phase 9 — Referral/Loyalty

- referral attribution
- rewards
- loyalty
- fraud/reversal rules

## Phase 10 — Advanced Platformization

- marketplace
- advanced analytics
- external calendar integrations
- additional deployment models

## Guiding Rule

New capability should be added as a reusable module when it has independent semantics and reuse potential, not as arbitrary code inside Service Business.
