# Security

## 1. Identity

Authentication is delegated to Identity.

Never store credentials in Service Business.

## 2. Authorization

Every business-scoped operation requires authorization in business context.

## 3. Tenant Isolation

Tenant scope is mandatory for reads and writes.

## 4. Object Access

Never expose an object solely because its ID exists.

Always verify:

- tenant ownership
- relationship
- permission

## 5. Payment Security

Do not store raw payment credentials.

Use provider tokens/sessions and Finance contracts.

Validate callbacks and make them idempotent.

## 6. Webhooks

Webhook endpoints must:

- verify authenticity
- record event identity
- reject duplicates safely
- avoid trusting unverified client data

## 7. Input Validation

Validate:

- IDs
- locale
- dates
- timezone
- amounts
- enum values
- free-text length
- uploaded media metadata

## 8. Rate Limiting

Protect:

- login-related integrations
- appointment creation
- availability queries
- payment initiation
- public endpoints
- webhook endpoints

## 9. Audit

Audit security-sensitive actions:

- role/capability changes
- staff changes
- policy changes
- payment-related actions
- appointment state changes
- configuration changes

## 10. Secrets

Secrets belong in deployment secret management/environment configuration, never source control.
