# Localization

## 1. First-Class Requirement

Multilingual support is an architectural requirement, not merely a frontend library.

## 2. Two Localization Domains

### System/UI localization

Examples:

- buttons
- validation messages
- menus
- system errors

### Business-content localization

Examples:

- business name
- business description
- service name
- service description
- category name
- location name
- notification content

These should remain conceptually separate.

## 3. Locale Model

Business:

```text
default_locale = fa-IR
supported_locales = [fa-IR, en-US, tr-TR]
```

Person:

```text
preferred_locale = en-US
```

## 4. Translatable Fields

Typical:

- Business.name
- Business.description
- Service.name
- Service.description
- Category.name
- Location.name
- Location.description
- NotificationTemplate.subject
- NotificationTemplate.body

## 5. Non-Translatable Fields

Normally:

- IDs
- price
- duration
- status
- timestamps
- phone
- email
- coordinates

## 6. Translation Storage

Conceptual:

```text
Service
├── id
├── business_id
├── duration
├── price
└── translations
    ├── fa-IR
    │   ├── name
    │   └── description
    ├── en-US
    │   ├── name
    │   └── description
    └── tr-TR
        ├── name
        └── description
```

Implementation may use translation tables, JSON structures, or another storage strategy, but the domain semantics must remain equivalent.

## 7. Fallback

```text
Person preferred locale
        ↓
Business default locale
        ↓
System default locale
```

## 8. API

API should return stable codes and structured data.

Example:

```json
{
  "code": "APPOINTMENT_SLOT_UNAVAILABLE",
  "message": "localized message",
  "details": {}
}
```

The `code` is stable; the message is localized.

## 9. Locale Negotiation

Possible inputs:

1. explicit request locale
2. authenticated person preference
3. business default
4. system default

Explicit client locale must not override business-supported locale without validation.

## 10. RTL/LTR

The product must support both:

- RTL languages
- LTR languages

UI direction is derived from locale.
