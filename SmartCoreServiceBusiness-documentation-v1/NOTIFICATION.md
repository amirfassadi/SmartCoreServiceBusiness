# Communication and Notification

## 1. Ownership

Service Business emits business events.

Communication/Notification decides how those events become messages.

## 2. Example

```text
AppointmentConfirmed
        ↓
Notification
   ├── Email
   ├── SMS
   └── Push
```

Service Business must not directly call SMS/email SDKs inside domain logic.

## 3. Channels

Possible channels:

- SMS
- Email
- Push
- in-app
- messaging integrations

## 4. Templates

Templates are localized.

```text
NotificationTemplate
├── event
├── channel
├── locale
├── subject
└── body
```

## 5. Recipient Locale

Resolve:

```text
person.preferred_locale
        ↓
business.default_locale
        ↓
system.default_locale
```

## 6. Preferences

Recipients may configure:

- enabled channels
- marketing preferences
- transactional notification preferences where legally permitted

Transactional messages may have mandatory delivery rules.

## 7. Async

Notification should normally be asynchronous.

Do not make appointment confirmation depend on successful SMS delivery.

## 8. Reliability

Use:

- retry
- idempotency
- delivery status
- dead-letter handling
- provider abstraction

## 9. Provider Abstraction

The core product must not hard-code a specific SMS/email provider.
