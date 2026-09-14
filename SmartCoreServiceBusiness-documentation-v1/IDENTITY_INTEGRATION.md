# Identity Integration

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
