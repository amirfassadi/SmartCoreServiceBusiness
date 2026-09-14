# Tenancy and Ownership

## 1. Model

The broader platform uses organization-centric ownership.

```text
Person
  ↓
Membership
  ↓
Organization
  ↓
Business
```

The exact relationship is governed by the Organization/Tenancy contract.

## 2. Isolation

Every tenant-owned Service Business record must be scoped to the correct business/organization.

Never rely only on frontend filtering.

## 3. Database

At minimum, tenant-owned tables should carry an ownership boundary such as:

```text
business_id
```

or an equivalent organization identifier defined by the platform contract.

## 4. Query Rule

Every read/write path must establish tenant context before accessing tenant data.

Bad:

```sql
SELECT * FROM appointments WHERE id = :id;
```

Preferred:

```sql
SELECT *
FROM appointments
WHERE id = :id
  AND business_id = :business_id;
```

## 5. Customer-Owned Database

The architecture must support a deployment where the complete application database belongs to one customer.

This is a deployment concern, not a different domain model.

## 6. Shared Database

Shared database deployments must preserve strict logical isolation.

## 7. Cross-Tenant Operations

Cross-tenant queries are forbidden in ordinary application flows.

Administrative/global analytics should use explicitly authorized platform-level services.
