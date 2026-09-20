# Identity Integration

## Current implementation boundary

Identity and generic Authorization are external integration boundaries, not implemented production subsystems in this repository. This repository does not contain Person, User, credentials, sessions, tokens, organizations, memberships, JWT validation, or an authorization engine.

The current backend accepts an external `organizationId` plus optional `actorId` through its request-context adapter and derives the selected `businessId` from the versioned route. Local development/integration tests may use test headers to populate this context. That mechanism is for development/testing only and must not be treated as production authentication or authorization.

Production enforcement depends on the upstream Identity/Organization/Authorization integration supplying authenticated and authorized context.

## 1. Ownership

Identity owns:

- Person
- authentication
- credentials
- sessions
- authentication tokens
- organizations
- memberships
- identity lifecycle

Service Business does not duplicate these.

## 2. Registration

Conceptually:

```text
POST /auth/register
       ↓
Person
       +
Personal Organization
       +
Owner Membership
```

The exact Identity API is defined by the Identity contract.

## 3. Authentication

Authenticated requests carry the authenticated person identity.

Service Business must never trust an arbitrary client-supplied `customer_id` to determine the current customer.

Instead:

```text
Authenticated Session
        ↓
Person ID
        ↓
Business Context
        ↓
BusinessCustomer relationship
```

## 4. Authorization

Identity answers:

> Who is this?

Authorization answers:

> What may this person do here?

Service Business defines business-specific permissions/capabilities and consumes the reusable authorization mechanism.

## 5. Multiple Relationships

Never use:

```text
user.role = "customer"
```

Use:

```text
Person
 └── Business
      ├── Customer
      ├── Staff
      ├── Manager
      └── Owner
```

## 6. Business Context

Every business-scoped request must establish:

- authenticated person
- business/organization context
- authorized capability

## 7. Logout / Session

Session lifecycle belongs to Identity.

Service Business should not implement its own competing authentication/session system.

## 8. Cross-Business Isolation

A person's membership in Business A does not grant access to Business B.

All business data access must be scoped by business/organization context.
