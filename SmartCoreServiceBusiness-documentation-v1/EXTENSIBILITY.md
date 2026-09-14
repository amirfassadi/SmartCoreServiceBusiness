# Extensibility

## 1. Goal

A new customer should primarily require configuration.

## 2. Configuration

Potential configuration:

```yaml
business:
  default_locale: fa-IR
  supported_locales:
    - fa-IR
    - en-US
  timezone: Asia/Tehran
  currency: IRR

booking:
  require_deposit: true
  booking_horizon_days: 30

features:
  loyalty: false
  referral: false
  gift_cards: false
```

Exact configuration schema should be versioned.

## 3. Feature Flags

Optional capabilities should be enabled by feature configuration rather than customer-specific forks.

## 4. Provider Configuration

Providers are selected by configuration.

Bad:

```text
if business == "CustomerX":
    use ProviderY
```

Good:

```text
payment.provider = configured_provider
```

## 5. Service Types

The generic Service entity should not become a beauty-specific class hierarchy.

Prefer:

- categories
- attributes
- capabilities
- resource requirements
- policies
- configuration

## 6. Custom Fields

Where useful, support controlled custom fields rather than modifying the schema for every customer.

Custom fields must still have:

- type
- validation
- permissions
- localization rules where applicable

## 7. White Label

Branding belongs to configuration:

- logo
- colors
- domain
- business name
- locale
- content

The core repository remains customer-neutral.

## 8. Integration Adapters

External integrations must be replaceable adapters.

Examples:

```text
PaymentProvider
NotificationProvider
StorageProvider
CalendarProvider
```

## 9. No Customer Forks

Customer-specific forks are a last resort.

Preferred order:

1. configuration
2. feature flag
3. extension point
4. module
5. custom development outside the generic core
