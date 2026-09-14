# Payment and Finance Integration

## 1. Ownership

Service Business decides:

- whether payment is required
- whether a deposit is required
- how much is required
- when an appointment may be confirmed
- business cancellation/refund policy

Finance/Payment owns:

- payment session
- provider interaction
- transaction state
- verification
- refund
- settlement
- ledger/accounting records

## 2. Provider Abstraction

The generic product must not hard-code a gateway.

Conceptual contract:

```typescript
interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<PaymentSession>;
  verifyPayment(input: VerifyPaymentInput): Promise<PaymentVerification>;
  handleCallback(input: PaymentCallbackInput): Promise<PaymentResult>;
}
```

## 3. Provider vs Method

Provider:

- Stripe
- PayPal
- local gateways
- bank providers
- crypto providers

Method:

- card
- bank transfer
- wallet
- crypto

These concepts must remain separate.

## 4. Payment Flow

```text
Appointment
   ↓
Payment Required
   ↓
Finance.createPayment
   ↓
Provider
   ↓
Customer completes payment
   ↓
Callback/verification
   ↓
PaymentSucceeded
   ↓
Appointment Confirmed
```

## 5. Callbacks

Callbacks must be:

- authenticated where possible
- idempotent
- persisted/audited
- safe to replay

## 6. Amounts

Always specify:

- amount
- currency
- precision rules
- provider reference

Never assume a universal currency.

## 7. Refund

A refund is a Finance operation.

Service Business requests/refers to the refund according to its policy.

## 8. Failure

Payment failure must not corrupt appointment state.

Possible outcome:

```text
awaiting_payment
      ↓
payment_failed
      ↓
retry / cancel / expire
```

## 9. Finance Decomposition

Finance may contain bounded contexts for:

- Payment
- Billing
- Invoice
- Transaction
- Ledger
- Refund
- Settlement
- Pricing
