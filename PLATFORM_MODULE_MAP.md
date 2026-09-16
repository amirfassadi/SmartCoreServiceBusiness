# نقشه ماژول‌های پلتفرم

## 1. هدف

این سند معماری ماژولار اکوسیستم SmartCore را تعریف می‌کند.

هدف این سند مشخص کردن موارد زیر است:

- چه قابلیت‌هایی باید به‌صورت ماژول‌های قابل استفاده مجدد طراحی شوند.
- مالک هر مفهوم و هر حوزه دامنه کدام ماژول است.
- کدام ماژول‌ها به سایر ماژول‌ها سرویس ارائه می‌دهند.
- ماژول‌ها چگونه با یکدیگر ارتباط برقرار می‌کنند.
- مالکیت داده‌ها در کجا قرار دارد.
- کدام مرزها در آینده می‌توانند به Repository یا Service مستقل تبدیل شوند.
- `SmartCoreServiceBusiness` چه جایگاهی در کل اکوسیستم دارد.

اصل اصلی معماری:

> **یک بار بساز، بارها پیکربندی و استفاده کن.**

`SmartCoreServiceBusiness` نباید تمام قابلیت‌های موردنیاز یک کسب‌وکار خدماتی را خودش پیاده‌سازی کند.

بلکه باید یک **دامنه کسب‌وکاری** باشد که از قابلیت‌های قابل استفاده مجدد پلتفرم استفاده می‌کند.

---

# 2. اصول معماری

## 2.1 ماژول با Repository یکی نیست

ماژول یک مرز منطقی در معماری است.

Repository یک مرز فیزیکی در کد است.

این دو الزاماً یکی نیستند.

برای مثال:

```text
Finance
├── Payment
├── Billing
├── Invoice
├── Ledger
└── Settlement
```

ممکن است در ابتدا همه این موارد داخل یک Repository قرار داشته باشند، اما همچنان از نظر معماری به‌عنوان قابلیت‌ها و Contextهای جداگانه در نظر گرفته شوند.

فقط زمانی که نیازهای زیر وجود داشته باشد، یک ماژول باید به Repository یا Service مستقل تبدیل شود:

- استقرار مستقل
- مقیاس‌پذیری مستقل
- مالکیت مستقل
- چرخه انتشار متفاوت
- مرز امنیتی مستقل
- نیاز به تکنولوژی متفاوت
- وجود مصرف‌کنندگان خارجی با API پایدار
- پیچیدگی عملیاتی که جداسازی را توجیه کند

---

## 2.2 مالکیت یکتای دامنه

هر مفهوم مهم باید یک مالک مشخص داشته باشد.

برای مثال:

```text
Person           → Identity
Organization     → Organization / Tenancy
Permission       → Authorization
Appointment      → Scheduling / Reservation
Payment          → Finance / Payment
Notification     → Communication
Service          → Service Business
Resource         → Resource
File             → Media
Audit Event      → Audit
```

هیچ ماژولی نباید یک نسخه دوم و مستقل از منبع اصلی یک مفهوم متعلق به ماژول دیگر ایجاد کند.

---

## 2.3 عدم دسترسی مستقیم به دیتابیس ماژول دیگر

یک ماژول نباید مستقیماً جداول دیتابیس ماژول دیگر را تغییر دهد.

### اشتباه

```text
ServiceBusiness
    ↓
UPDATE finance.payments
```

### صحیح

```text
ServiceBusiness
    ↓
Payment API / Contract
    ↓
Finance
```

یا:

```text
ServiceBusiness
    ↓
Domain Event
    ↓
Finance
```

---

## 2.4 عدم وجود وابستگی حلقوی

وابستگی بین ماژول‌ها باید جهت‌دار باشد.

مثلاً:

```text
Identity
   ↓
Organization
   ↓
Service Business
   ↓
Scheduling
   ↓
Finance
```

یک ماژول نباید به ماژولی وابسته شود که خودش به آن ماژول وابسته است.

وابستگی حلقوی یک مشکل معماری است و باید با استفاده از موارد زیر برطرف شود:

- Contract
- Event
- Abstraction
- تغییر مالکیت Domain

---

## 2.5 قرارداد به‌جای Implementation

ماژول‌ها باید از طریق موارد زیر با یکدیگر ارتباط برقرار کنند:

- API
- Interface
- Domain Contract
- Integration Event
- Command
- Query

یک ماژول نباید به Implementation داخلی ماژول دیگر وابسته باشد.

---

## 2.6 انتزاع Provider

Providerهای خارجی نباید وارد منطق اصلی کسب‌وکار شوند.

برای مثال:

```text
Finance
   │
   ├── Payment Provider Interface
   │       ├── Stripe
   │       ├── PayPal
   │       ├── Local Gateway
   │       └── Crypto Provider
   │
   └── Payment Domain
```

دامنه باید با مفهومی مانند:

```text
PaymentProvider
```

کار کند، نه مستقیماً با:

```text
ZarinpalPaymentProvider
```

بنابراین هیچ Payment Provider خاصی نباید در Core عمومی سیستم Hard-Code شود.

---

# 3. نمای کلی اکوسیستم

پلتفرم در چهار گروه اصلی سازمان‌دهی می‌شود.

```text
┌───────────────────────────────────────────────────────────┐
│                     FOUNDATION                            │
│                                                           │
│ Identity | Authorization | Organization | Configuration   │
│ Localization | Media | Audit | Event | Observability     │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                    OPERATIONAL                            │
│                                                           │
│ Scheduling | Reservation | Resource | Workflow            │
│ Communication | Notification | Search                     │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                     FINANCIAL                             │
│                                                           │
│ Finance | Payment | Billing | Invoice | Ledger             │
│ Pricing | Settlement                                      │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                  BUSINESS / COMMERCE                      │
│                                                           │
│ Service Business | Commerce | Subscription | Membership   │
│ Marketplace | Referral | Loyalty | Promotion              │
└───────────────────────────────────────────────────────────┘
```

---

# 4. ماژول‌های Foundation

## 4.1 Identity

### هدف

Identity به این سؤال پاسخ می‌دهد:

> این شخص چه کسی است؟

Identity مالک هویت و احراز هویت است.

### مسئولیت‌ها

- Person
- Credentials
- Authentication
- Session
- Refresh Token
- Login
- Logout
- Registration
- Personal Identity
- Organization Membership Identity

### مسئولیت‌های خارج از Identity

Identity نباید مالک موارد زیر باشد:

- Customer در Service Business
- Staff در Service Business
- Appointment
- Payment
- Permissionهای دامنه‌ای
- Roleهای مخصوص یک Business

مثال:

یک شخص می‌تواند فقط یک هویت داشته باشد:

```text
Person
id = p123
```

اما در چند کسب‌وکار حضور داشته باشد:

```text
Person
 ├── Business A → Customer
 ├── Business A → Staff
 ├── Business B → Manager
 └── Business C → Owner
```

Identity نباید معنای این Relationshipها را بداند.

---

# 5. Authorization

## هدف

Authorization به این سؤال پاسخ می‌دهد:

> این شخص اجازه انجام چه کاری را دارد؟

Identity و Authorization مرتبط هستند اما یکی نیستند.

```text
Identity
    ↓
چه کسی هستی؟

Authorization
    ↓
چه کاری اجازه داری انجام دهی؟
```

### مسئولیت‌ها

- Permission
- Policy
- Roleهای عمومی
- Capability Check
- Access Decision

### مسئولیت‌های خارج از Authorization

Authorization مالک Relationshipهای خاص یک Business نیست.

مثلاً:

```text
"آیا این شخص اجازه تغییر قیمت Service را دارد؟"
```

ممکن است نیازمند ترکیب موارد زیر باشد:

```text
Authorization
+
Service Business Policy
```

---

# 6. Organization / Tenancy

## هدف

این ماژول Context مربوط به Business و Tenant را فراهم می‌کند.

### مسئولیت‌ها

- Organization
- Tenant
- Membership
- Ownership
- Organization Boundary
- Organization Context

مثال:

```text
Person
   │
   └── Membership
          │
          └── Organization
                 │
                 └── Service Business
```

یک شخص می‌تواند عضو چند Organization باشد.

---

# 7. Configuration

## هدف

مدیریت تنظیمات قابل استفاده مجدد.

نمونه‌ها:

- Feature Flag
- Business Settings
- Operational Settings
- Module Settings
- Provider Configuration
- Environment Configuration

Configuration نباید به محل ذخیره اطلاعات Domain تبدیل شود.

---

# 8. Localization

Localization یک **قابلیت اصلی و سطح اول پلتفرم** است.

چندزبانه بودن نباید صرفاً یک قابلیت Frontend باشد.

این موضوع باید در سطح معماری Domain و Platform در نظر گرفته شود.

---

## 8.1 لایه‌های Locale

چند نوع Context برای زبان وجود دارد.

### System Locale

زبان‌هایی که پلتفرم از آن‌ها پشتیبانی می‌کند.

مثال:

```text
fa-IR
en-US
tr-TR
```

### Business Locale

هر Business مشخص می‌کند:

```text
default_locale
supported_locales[]
```

مثال:

```text
Business
├── default_locale: fa-IR
└── supported_locales:
    ├── fa-IR
    ├── en-US
    └── tr-TR
```

### Person Locale

هر شخص می‌تواند زبان ترجیحی خودش را داشته باشد:

```text
preferred_locale
```

این سه مفهوم باید از یکدیگر جدا باشند.

---

# 9. مالکیت Localization

Localization مسئول موارد زیر است:

- تعریف Locale
- Fallback
- Translation Resolution
- Templateهای چندزبانه
- پیام‌های سیستم
- Metadata مربوط به Localization

اما خود Business Domain مالک محتوای Business است.

برای مثال:

```text
Service Business
    owns:
        Service

Localization
    provides:
        Translation Mechanism
```

---

# 10. فیلدهای قابل ترجمه

مثال:

```text
Business.name
Business.description

Service.name
Service.description

Category.name

Location.name
Location.description
```

مدل مفهومی:

```text
Service
├── id
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

---

# 11. داده‌های غیرقابل ترجمه

نمونه‌ها:

```text
price
duration
status
phone
email
coordinates
IDs
timestamps
```

---

# 12. Fallback زبان

Fallback پیشنهادی:

```text
Person Preferred Locale
        ↓
Business Default Locale
        ↓
System Default Locale
```

مثال:

```text
Person: tr-TR
Business: fa-IR
System: en-US
```

اگر ترجمه ترکی وجود نداشته باشد:

```text
tr-TR
   ↓
fa-IR
   ↓
en-US
```

---

# 13. Error Codeهای پایدار

API نباید به متن ترجمه‌شده Error وابسته باشد.

مثال:

```json
{
  "code": "APPOINTMENT_SLOT_UNAVAILABLE",
  "message": "The selected time is no longer available.",
  "details": {}
}
```

مقدار اصلی:

```text
code
```

است.

`message` می‌تواند براساس زبان کاربر ترجمه شود.

---

# 14. Media / File

## هدف

مدیریت عمومی فایل و Media.

### مسئولیت‌ها

- File
- Image
- Attachment
- Storage Abstraction
- Metadata
- Access Policy
- Upload / Download Lifecycle

### Storage Providerها

مثلاً:

```text
Local Storage
S3
Azure Blob
Dropbox
Other Object Storage
```

Service Business نباید جزئیات پیاده‌سازی Storage را بداند.

---

# 15. Audit

## هدف

ثبت تغییرات و عملیات مهم سیستم.

### مسئولیت‌ها

```text
Actor
Action
Resource
Before
After
Timestamp
Context
```

مثال:

```text
Manager changed:

Service.price

from:
1,000,000

to:
1,200,000
```

Audit باید برای همه Domainها قابل استفاده باشد.

---

# 16. Event Platform

## هدف

فراهم کردن ارتباط Asynchronous بین ماژول‌ها.

### مسئولیت‌ها

- Domain Events
- Integration Events
- Event Bus
- Delivery
- Retry
- Dead Letter
- Event Subscription

مثال:

```text
AppointmentConfirmed
        │
        ├── Communication
        ├── Workflow
        ├── Analytics
        ├── Referral
        └── Loyalty
```

ماژول Appointment نباید لازم باشد تمام مصرف‌کنندگان Event را بشناسد.

---

# 17. Observability

قابلیت فنی مشترک برای:

- Logging
- Metrics
- Tracing
- Health Check
- Correlation ID
- Diagnostics

Observability باید بیشتر یک قابلیت زیرساختی باشد تا Domain Business.

---

# 18. ماژول‌های Operational

## 18.1 Scheduling

Scheduling به این سؤال پاسخ می‌دهد:

> چه زمانی امکان انجام یک کار وجود دارد؟

### مسئولیت‌ها

- Calendar
- Working Hours
- Availability
- Time Slot
- Block
- Override
- Scheduling Rules

مدل مفهومی:

```text
Calendar
    ↓
Working Hours
    ↓
Availability
    ↓
Time Slots
```

---

# 19. Reservation

Reservation به این سؤال پاسخ می‌دهد:

> چه زمان یا Resourceای رزرو شده است؟

### مسئولیت‌ها

- Reservation
- Reservation Lifecycle
- Reservation State
- Reservation Locking
- Cancellation
- Rescheduling

مثال:

```text
Reservation
├── subject
├── start
├── end
├── participants
├── resources
└── status
```

Scheduling مشخص می‌کند چه زمانی آزاد است.

Reservation آن زمان را رزرو می‌کند.

---

# 20. Resource

## هدف

مدل‌سازی منابع فیزیکی یا منطقی موردنیاز برای انجام یک عملیات.

مثال:

```text
Room
Chair
Equipment
Vehicle
Treatment Room
Repair Bay
Machine
```

مدل:

```text
Resource
├── Resource Type
├── Resource
├── Availability
└── Allocation
```

یک Appointment ممکن است نیازمند موارد زیر باشد:

```text
Staff
+
Resource
+
Time
```

Resource باید مستقل از Service Business قابل استفاده باشد.

---

# 21. Workflow

Workflow مسئول Orchestration است.

مثال:

```text
AppointmentCreated
        ↓
PaymentRequired
        ↓
PaymentSucceeded
        ↓
AppointmentConfirmed
        ↓
24h Reminder
        ↓
AppointmentCompleted
```

### مسئولیت‌ها

- Workflow Definition
- Workflow Instance
- Step
- Transition
- Trigger
- Action

Domainهای اصلی نباید خودشان یک Workflow Engine بزرگ پیاده‌سازی کنند.

---

# 22. Communication

Communication قابلیت‌های ارتباطی خروجی را فراهم می‌کند.

```text
Communication
├── Messaging
│   ├── SMS
│   ├── Email
│   └── Push
├── Template
├── Notification
├── Delivery
└── Preference
```

Business Domain Event تولید می‌کند.

Communication تصمیم می‌گیرد:

- گیرنده چه کسی است.
- از چه Channel استفاده شود.
- کدام Template استفاده شود.
- زبان گیرنده چیست.
- ارسال چگونه انجام شود.
- Retry چگونه انجام شود.

---

# 23. Notification

Notification از نظر معماری بخشی از Communication است، اما بهتر است به‌صورت مفهومی از Business Event جدا باشد.

مثال:

```text
AppointmentConfirmed
        ↓
Notification
        ↓
Recipient Preference
        ↓
Localized Template
        ↓
SMS / Email / Push
```

Notificationها معمولاً باید Asynchronous باشند.

خرابی ارسال Notification نباید باعث Rollback شدن Appointment موفق شود.

---

# 24. Search

قابلیت جستجوی عمومی.

### مسئولیت‌ها

- Index
- Query
- Filter
- Facet
- Ranking

Business Domain اطلاعات قابل جستجو را فراهم می‌کند.

Search مسئول مکانیزم Indexing است، نه منبع اصلی اطلاعات.

---

# 25. ماژول‌های مالی

Finance نباید یک مسئولیت بزرگ و بدون مرز باشد.

از نظر منطقی:

```text
Finance
├── Payment
├── Billing
├── Invoice
├── Transaction
├── Ledger
├── Refund
├── Settlement
└── Pricing
```

این موارد می‌توانند در ابتدا در یک Repository باشند، اما باید مرزهای Domain آن‌ها مشخص باشد.

---

# 26. Payment

Payment به این سؤال پاسخ می‌دهد:

> آیا پول از طریق یک مکانیزم پرداخت با موفقیت جابه‌جا شده است؟

### مسئولیت‌ها

- Payment
- Payment Attempt
- Payment State
- Verification
- Callback Processing
- Refund
- Provider Integration

مثال:

```text
Payment
├── id
├── amount
├── currency
├── provider
├── method
├── status
└── external_reference
```

---

# 27. Payment Provider و Payment Method

این دو مفهوم نباید با هم ترکیب شوند.

### Provider

چه کسی پرداخت را پردازش می‌کند؟

```text
Stripe
PayPal
Local Gateway
Crypto Provider
```

### Method

مشتری چگونه پرداخت می‌کند؟

```text
Card
Bank Transfer
Wallet
Crypto
```

---

# 28. Payment Provider Interface

مدل مفهومی:

```typescript
interface PaymentProvider {
  createPayment(
    input: CreatePaymentInput
  ): Promise<PaymentSession>;

  verifyPayment(
    input: VerifyPaymentInput
  ): Promise<PaymentVerification>;

  handleCallback(
    input: PaymentCallbackInput
  ): Promise<PaymentResult>;
}
```

Business Domain نباید مستقیماً به Provider خاص وابسته باشد.

---

# 29. Billing

Billing به این سؤال پاسخ می‌دهد:

> مشتری چه مبلغی بدهکار است؟

مثال:

- تولید Invoice
- Charge
- Billing Cycle
- Balance
- Billing Document

---

# 30. Invoice

Invoice یک سند مالی است.

مثال:

```text
Invoice
├── number
├── customer
├── items
├── subtotal
├── discount
├── tax
├── total
├── currency
└── status
```

---

# 31. Ledger

Ledger مسئول ثبت سوابق مالی است.

Ledger باید قابل Audit و ترجیحاً Append-Oriented باشد.

Business Domain نباید مستقیماً Ledger Entry ایجاد یا اصلاح کند.

---

# 32. Pricing

Pricing به این سؤال پاسخ می‌دهد:

> قیمت نهایی یک چیز چقدر است؟

قابلیت‌ها می‌توانند شامل موارد زیر باشند:

- Base Price
- Dynamic Pricing
- Discount
- Pricing Rules
- Currency
- Effective Date

یک Service Business ممکن است مالک این واقعیت باشد که یک Service قیمت دارد.

اما مکانیزم عمومی Pricing می‌تواند توسط Pricing Module مدیریت شود.

---

# 33. Settlement

Settlement مسئول موارد زیر است:

- Settlement با Provider
- Settlement با Business
- Marketplace Settlement
- Commission
- Payout Lifecycle

این ماژول در آینده برای Marketplace اهمیت بیشتری پیدا می‌کند.

---

# 34. Service Business

`SmartCoreServiceBusiness` یک **Domain Application** است، نه Foundation پلتفرم.

هدف آن مدل‌سازی کسب‌وکارهایی است که خدمات ارائه می‌کنند.

## مسئولیت‌ها

### Business

- Business Profile
- Business Identity در Domain
- Business Policies
- Business Configuration

### Service Catalog

- Service
- Service Category
- Service Definition
- Service-specific Rules

### Business Relationships

یک Person می‌تواند هم‌زمان چند Relationship با یک Business داشته باشد.

مثلاً:

```text
Customer
Staff
Manager
Owner
```

این Relationshipها متعلق به Business Domain هستند، نه Identity.

---

# 35. Service Business نباید مالک چه چیزهایی باشد؟

موارد زیر نباید به Implementation داخلی Service Business تبدیل شوند:

```text
Authentication
Sessions
Generic Identity
Generic Authorization
Generic File Storage
Payment Provider Infrastructure
SMS Provider Infrastructure
Email Infrastructure
Generic Scheduling Engine
Generic Resource Engine
Generic Workflow Engine
Generic Notification Engine
Generic Localization Engine
Generic Audit Engine
Generic Event Bus
Generic Search Engine
Generic Accounting Ledger
```

Service Business از این قابلیت‌ها استفاده می‌کند.

---

# 36. Customer Relationship

Service Business می‌تواند مفهوم:

```text
BusinessCustomer
```

را داشته باشد.

این مفهوم Relationship زیر را نشان می‌دهد:

```text
Person
    ↓
Business
    ↓
Customer
```

این با Person در Identity یکی نیست.

---

# 37. Staff Relationship

به همین شکل:

```text
BusinessStaff
```

نمایانگر:

```text
Person
    ↓
Business
    ↓
Staff
```

است.

یک شخص می‌تواند هم‌زمان:

```text
Customer
+
Staff
+
Manager
```

در یک Business باشد.

بنابراین مدل زیر قابل قبول نیست:

```text
user.role
```

Role نباید جای Relationshipهای Business را بگیرد.

---

# 38. نمونه مدل Identity + Business

```text
Person
  │
  ├── Membership → Business A
  │
  └── Membership → Business B

Business A
  ├── Customer Relationship
  ├── Staff Relationship
  └── Manager Relationship

Business B
  └── Owner Relationship
```

Identity پاسخ می‌دهد:

> این شخص چه کسی است؟

Service Business پاسخ می‌دهد:

> رابطه این شخص با این Business چیست؟

Authorization پاسخ می‌دهد:

> این شخص چه کاری می‌تواند انجام دهد؟

---

# 39. Commerce

Commerce یک قابلیت عمومی کسب‌وکاری است.

حوزه احتمالی:

```text
Commerce
├── Product
├── Catalog
├── Cart
├── Order
├── Promotion
├── Coupon
├── Gift Card
├── Bundle
└── Membership
```

همه Service Businessها به Commerce نیاز ندارند.

بنابراین Commerce نباید داخل Core Service Business قرار گیرد.

---

# 40. Subscription

Subscription برای Businessهای دارای رابطه تکرارشونده مناسب است.

```text
Subscription
├── Plan
├── Subscription
├── Renewal
├── Entitlement
└── Cancellation
```

مثال:

- عضویت باشگاه
- Membership سالن
- قرارداد نگهداری
- Service Plan

---

# 41. Membership

Membership نشان‌دهنده مشارکت تجاری یا دسترسی ویژه مشتری است.

می‌تواند توسط موارد زیر استفاده شود:

- Service Business
- Commerce
- Subscription
- Loyalty

اما Membership تجاری با Membership سازمانی یکی نیست.

### Organization Membership

```text
Person belongs to Organization
```

### Business Membership

```text
Customer has a commercial/business membership
```

این دو مفهوم باید جدا باقی بمانند.

---

# 42. Marketplace

Marketplace یک قابلیت Commerce سطح بالاتر است.

مسئولیت‌های احتمالی:

- چند فروشنده / Provider
- Marketplace Listing
- Commission
- Seller Onboarding
- Settlement
- Marketplace Order

Marketplace می‌تواند از موارد زیر استفاده کند:

```text
Identity
Organization
Finance
Payment
Commerce
Settlement
```

اما نباید صرفاً به دلیل اینکه برخی Service Businessها ممکن است در آینده Marketplace شوند، داخل Service Business قرار گیرد.

---

# 43. Referral

Referral یک قابلیت عمومی برای رشد و معرفی مشتری است.

مدل مفهومی:

```text
Referral
├── Referral Identity
│   └── Referral Code / Token
│
├── Referral Relationship
│   ├── Referrer
│   ├── Referred
│   ├── Attribution
│   └── Created At
│
├── Referral Lifecycle
│   ├── Pending
│   ├── Qualified
│   ├── Rewarded
│   └── Reversed
│
└── Referral Events
```

انواع Reward:

```text
Percentage
Fixed Credit
Discount
Commission
Wallet Credit
```

Referral باید قابلیت‌های زیر را در نظر بگیرد:

- Attribution Locking
- Expiry
- Reward Caps
- جلوگیری از Self Referral
- Fraud Detection
- Reversal

Referral باید مستقل از Service Business باشد.

---

# 44. Loyalty

Loyalty می‌تواند قابلیت‌های زیر را فراهم کند:

- Points
- Tier
- Reward
- Customer Status
- Redemption

می‌تواند Eventهایی مانند موارد زیر را مصرف کند:

```text
OrderCompleted
AppointmentCompleted
PaymentSucceeded
```

---

# 45. Promotion

Promotion قابلیت‌های عمومی تبلیغاتی و تخفیفی را فراهم می‌کند:

```text
Promotion
Coupon
Discount
Campaign
Eligibility Rule
```

Business می‌تواند از Promotion استفاده کند بدون اینکه خودش Promotion Engine را پیاده‌سازی کند.

---

# 46. جهت وابستگی ماژول‌ها

جهت کلی پیشنهادی:

```text
                  FOUNDATION
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
  Operational      Financial         Commerce
       │               │                │
       └───────────────┼────────────────┘
                       ▼
                Business Domains
```

به‌صورت جزئی‌تر:

```text
Identity
   ↓
Organization / Tenancy
   ↓
Authorization
   ↓
Business Domains
```

و در کنار آن:

```text
Scheduling
Resource
Workflow
Communication
Finance
Commerce
Subscription
Referral
Loyalty
```

به‌عنوان قابلیت‌های قابل استفاده مجدد از طریق Contract مصرف می‌شوند.

---

# 47. نمونه جریان Service Business

فرض کنیم مشتری قصد رزرو یک Service را دارد و باید بیعانه پرداخت کند.

```text
Customer
   │
   ▼
Identity
   │
   ▼
Service Business
   │
   ├── Validate Service
   │
   ├── Check Business Policy
   │
   ▼
Scheduling
   │
   ├── Availability
   ├── Working Hours
   └── Time Slot
   │
   ▼
Resource
   │
   └── Staff / Room / Equipment
   │
   ▼
Reservation
   │
   ▼
Finance / Payment
   │
   ├── Create Payment
   ├── Verify Payment
   └── Record Transaction
   │
   ▼
Event Platform
   │
   └── AppointmentConfirmed
          │
          ├── Communication
          ├── Workflow
          ├── Loyalty
          └── Referral
```

Service Business فقط Domain Intent و Business Policy را مدیریت می‌کند و همه این قابلیت‌ها را خودش پیاده‌سازی نمی‌کند.

---

# 48. مالکیت Appointment

Appointment یک مفهوم Business است، اما مکانیزم Scheduling آن قابل استفاده مجدد است.

بنابراین:

```text
Service Business
    owns:
        Service Booking Intent
        Business Policy
        Service Context

Scheduling / Reservation
    owns:
        Time
        Reservation
        Availability
        Resource Allocation
```

این تفکیک مانع تبدیل شدن Service Business به یک Monolith بزرگ می‌شود.

---

# 49. نمونه Booking

درخواست Booking می‌تواند مفهومی شبیه این داشته باشد:

```json
{
  "business_id": "business-123",
  "service_id": "service-456",
  "staff_id": "staff-789",
  "start": "2026-09-20T15:00:00",
  "duration": 60,
  "customer_id": "person-123"
}
```

Service Business بررسی می‌کند:

```text
آیا Service وجود دارد؟
آیا قابل رزرو است؟
Policy کسب‌وکار چیست؟
آیا این Customer اجازه رزرو دارد؟
آیا Deposit لازم است؟
```

Scheduling بررسی می‌کند:

```text
آیا زمان موردنظر آزاد است؟
```

Resource بررسی می‌کند:

```text
آیا Staff / Resource موردنیاز در دسترس است؟
```

Finance بررسی می‌کند:

```text
آیا Payment موردنیاز با موفقیت انجام شده است؟
```

---

# 50. یکپارچه‌سازی Event محور

الگوی ترجیحی:

```text
Domain Module
      │
      ▼
Domain Event
      │
      ▼
Event Platform
      │
      ├── Consumer A
      ├── Consumer B
      ├── Consumer C
      └── Consumer D
```

مثال:

```text
AppointmentConfirmed
```

می‌تواند توسط موارد زیر مصرف شود:

```text
Communication
Workflow
Loyalty
Referral
Analytics
```

Service Business نباید مستقیماً به تک‌تک این مصرف‌کنندگان وابسته باشد.

---

# 51. ارتباط Synchronous و Asynchronous

از APIهای Synchronous زمانی استفاده شود که پاسخ فوری لازم است.

مثال:

```text
Check Availability
Create Payment
Verify Payment
Get Business
Get Service
```

از Event زمانی استفاده شود که عملیات می‌تواند مستقل از عملیات اصلی انجام شود.

مثال:

```text
AppointmentConfirmed
PaymentSucceeded
CustomerRegistered
AppointmentCompleted
```

---

# 52. جدول مالکیت داده

| مفهوم | مالک |
|---|---|
| Person | Identity |
| Credentials | Identity |
| Session | Identity |
| Organization | Organization / Tenancy |
| Membership سازمانی | Organization / Tenancy |
| Permission | Authorization |
| Business | Service Business |
| Customer Relationship | Service Business |
| Staff Relationship | Service Business |
| Service | Service Business |
| Service Category | Service Business |
| Calendar | Scheduling |
| Availability | Scheduling |
| Reservation | Reservation |
| Resource | Resource |
| Resource Allocation | Resource |
| Payment | Finance |
| Payment Attempt | Finance |
| Invoice | Billing |
| Ledger Entry | Ledger |
| Pricing Rule | Pricing |
| Notification | Communication |
| Message Template | Communication |
| File | Media |
| Audit Event | Audit |
| Workflow | Workflow |
| Search Index | Search |
| Referral | Referral |
| Loyalty Account | Loyalty |
| Subscription | Subscription |
| Product | Commerce |
| Order | Commerce |

---

# 53. قوانین تعامل بین ماژول‌ها

## قانون 1

هیچ ماژولی نباید مستقیماً به Database ماژول دیگر دسترسی داشته باشد.

## قانون 2

هیچ ماژولی نباید Implementation داخلی ماژول دیگر را Import کند.

## قانون 3

از Contractهای پایدار استفاده شود.

## قانون 4

برای Reactionهای مستقل از Event استفاده شود.

## قانون 5

Chainهای طولانی Synchronous تا حد امکان ایجاد نشوند.

بد:

```text
A → B → C → D → E → F
```

بهتر:

```text
A
 ↓
Event
 ↓
B
C
D
E
```

زمانی که عملیات مستقل هستند.

## قانون 6

هر ماژول مالک داده خودش باشد.

## قانون 7

هر Provider خارجی باید پشت Adapter قرار بگیرد.

## قانون 8

Localization باید یک قابلیت سطح پلتفرم باشد.

## قانون 9

Business-specific Semantics نباید وارد Platform Moduleهای عمومی شوند.

## قانون 10

هر Generic Module باید خارج از Service Business نیز قابل استفاده باشد.

---

# 54. تصمیم‌گیری برای تبدیل Module به Repository

یک Module زمانی باید به Repository مستقل تبدیل شود که یک یا چند مورد زیر وجود داشته باشد:

- نیاز به Deployment مستقل
- نیاز به Scaling مستقل
- Ownership مستقل
- Release Lifecycle متفاوت
- Security Boundary مستقل
- Technology Stack متفاوت
- مصرف‌کنندگان خارجی
- API عمومی و پایدار
- پیچیدگی عملیاتی بالا

در غیر این صورت:

> ماژول را به‌عنوان یک Module داخل Repository بزرگ‌تر نگه می‌داریم.

---

# 55. ساختار پیشنهادی اولیه

ساختار منطقی می‌تواند به شکل زیر باشد:

```text
SmartCore/
├── Identity/
├── Authorization/
├── Organization/
├── Localization/
├── Configuration/
├── Media/
├── Audit/
├── Event/
├── Observability/
│
├── Scheduling/
├── Reservation/
├── Resource/
├── Workflow/
├── Communication/
├── Search/
│
├── Finance/
│   ├── Payment/
│   ├── Billing/
│   ├── Invoice/
│   ├── Ledger/
│   ├── Pricing/
│   └── Settlement/
│
├── ServiceBusiness/
├── Commerce/
├── Subscription/
├── Marketplace/
├── Referral/
├── Loyalty/
└── Promotion/
```

این ساختار **Logical Architecture** است و به این معنی نیست که هر Directory الزاماً باید یک Git Repository مستقل باشد.

---

# 56. Core Platformهای پیشنهادی

اولویت بالاتر برای قابلیت‌های قابل استفاده مجدد:

```text
Identity
Authorization
Organization
Localization
Finance
Communication
Scheduling
Resource
Workflow
Media
Audit
Event
```

این‌ها قابلیت‌هایی هستند که احتمالاً در بسیاری از محصولات آینده استفاده خواهند شد.

---

# 57. وابستگی‌های MVP برای Service Business

اولین نسخه Service Business نباید کل اکوسیستم را پیاده‌سازی کند.

وابستگی‌های اولیه:

```text
Identity
   │
Organization
   │
Authorization
   │
Localization
   │
Service Business
   │
   ├── Scheduling
   ├── Reservation
   ├── Resource
   ├── Finance / Payment
   ├── Communication
   └── Event
```

قابلیت‌های زیر می‌توانند در مراحل بعد اضافه شوند:

```text
Commerce
Subscription
Marketplace
Referral
Loyalty
Promotion
```

---

# 58. نمونه محصولات آینده

معماری باید اجازه ایجاد محصولاتی مانند موارد زیر را بدهد:

```text
Beauty Salon
Clinic
Barbershop
Repair Shop
Car Service
Cleaning Company
Fitness Center
Consulting Business
Photography Studio
Dental Clinic
Pet Care
Home Services
Equipment Rental
```

بدون اینکه Foundation پلتفرم از نو نوشته شود.

تفاوت این محصولات عمدتاً باید در این موارد باشد:

```text
Configuration
+
Business Rules
+
Domain Extensions
```

نه در Infrastructure تکراری.

---

# 59. نمونه Beauty Salon

یک سالن زیبایی می‌تواند این‌گونه Configure شود:

```text
Business Type:
    Beauty Salon

Services:
    Haircut
    Hair Coloring
    Facial
    Manicure

Resources:
    Hairdresser
    Chair
    Treatment Room

Scheduling:
    Appointment

Payment:
    Deposit

Communication:
    SMS
    Email

Localization:
    fa-IR
    en-US
    tr-TR
```

هیچ‌کدام از این موارد نباید باعث تغییر Identity شوند.

---

# 60. مرز Generic Product

محصول Generic باید پاسخ دهد:

> چگونه یک کسب‌وکار خدماتی را مدیریت کنیم؟

نه اینکه پاسخ دهد:

> یک سالن خاص چگونه کار می‌کند؟

بنابراین Ruleهای مخصوص یک مشتری باید در Configuration یا Domain Extension قرار بگیرند.

---

# 61. Configuration در برابر Custom Development

از Configuration برای موارد زیر استفاده شود:

- Business Name
- Logo
- Supported Languages
- Currency
- Timezone
- Business Hours
- Service Catalog
- Payment Providers
- Notification Channels
- Booking Policies
- Deposit Rules

Custom Domain Development فقط زمانی انجام شود که Business واقعاً رفتار جدیدی نیاز داشته باشد.

---

# 62. اصل API چندزبانه

APIها باید در صورت نیاز Context زبان را پشتیبانی کنند.

مثال:

```http
GET /api/public/business/{slug}?locale=fa-IR
```

یا:

```http
Accept-Language: fa-IR
```

روش دقیق در مرحله طراحی API مشخص خواهد شد، اما Localization باید بخشی از Contract باشد.

---

# 63. Admin چندزبانه

پنل مدیریت نیز باید قابلیت چندزبانه بودن داشته باشد.

باید بین دو مفهوم تفاوت وجود داشته باشد:

```text
UI Translation
```

و:

```text
Business Content Translation
```

مثلاً:

```text
"Save Service"
```

یک UI Translation است.

اما:

```text
"Hair Coloring"
```

یک Business Content Translation است.

این دو نباید با یک مکانیزم مفهومی ذخیره شوند.

---

# 64. Localization در Notification

Notification باید Locale را تقریباً به این شکل تعیین کند:

```text
Recipient Preferred Locale
        ↓
Business Default Locale
        ↓
System Default Locale
```

مثال:

```text
AppointmentConfirmed
        ↓
Customer locale = tr-TR
        ↓
Turkish Template
        ↓
SMS
```

خود Business Event نباید به زبان خاصی وابسته باشد.

---

# 65. خلاصه معماری

ایده اصلی معماری این است:

> `SmartCoreServiceBusiness` مصرف‌کننده قابلیت‌های قابل استفاده مجدد است، نه مالک تمام قابلیت‌هایی که به آن‌ها نیاز دارد.

بنابراین موارد زیر باید از Service Business جدا باشند:

```text
Identity
Authorization
Organization
Localization
Finance
Communication
Scheduling
Reservation
Resource
Workflow
Media
Audit
Event
```

و قابلیت‌های سطح بالاتر زیر می‌توانند به‌صورت Optional به سیستم اضافه شوند:

```text
Commerce
Subscription
Marketplace
Referral
Loyalty
Promotion
```

---

# 66. معماری هدف

```text
                              ┌───────────────────┐
                              │     Identity      │
                              │ Person / Auth     │
                              │ Session           │
                              └─────────┬─────────┘
                                        │
                              ┌─────────▼─────────┐
                              │ Organization /    │
                              │ Tenancy           │
                              └─────────┬─────────┘
                                        │
                              ┌─────────▼─────────┐
                              │ Authorization     │
                              └─────────┬─────────┘
                                        │
                    ┌───────────────────▼───────────────────┐
                    │          SERVICE BUSINESS             │
                    │                                       │
                    │ Business                              │
                    │ Customer Relationships                │
                    │ Staff Relationships                   │
                    │ Service Catalog                       │
                    │ Business Policies                     │
                    └───────┬────────┬────────┬─────────────┘
                            │        │        │
             ┌──────────────┘        │        └──────────────┐
             ▼                       ▼                       ▼
       Scheduling              Resource                  Finance
             │                       │                       │
             ▼                       ▼                       ▼
       Reservation             Allocation               Payment
                                                            │
                                                            ▼
                                                     Billing / Ledger


        ┌────────────────────────────────────────────────────────┐
        │                CROSS-CUTTING CAPABILITIES              │
        │                                                        │
        │ Localization | Event | Communication | Media | Audit  │
        │ Workflow     | Search | Observability | Configuration │
        └────────────────────────────────────────────────────────┘


        ┌────────────────────────────────────────────────────────┐
        │                 OPTIONAL CAPABILITIES                  │
        │                                                        │
        │ Commerce | Subscription | Marketplace | Referral      │
        │ Loyalty  | Promotion                                   │
        └────────────────────────────────────────────────────────┘
```

---

# 67. قانون نهایی معماری

قبل از اضافه کردن هر قابلیت جدید، این سؤالات باید پرسیده شوند:

1. آیا این قابلیت مخصوص Service Business است؟
2. آیا محصول دیگری نیز می‌تواند از آن استفاده کند؟
3. آیا ماژول دیگری مالک این مفهوم است؟
4. آیا این یک قابلیت عمومی و قابل استفاده مجدد است؟
5. ارتباط آن باید Synchronous باشد یا Event-driven؟
6. آیا به مالکیت مستقل داده نیاز دارد؟
7. آیا نیاز به Localization دارد؟
8. آیا به Provider خارجی متصل می‌شود؟
9. این یک مسئولیت Domain است یا Infrastructure؟
10. آیا پیاده‌سازی آن در اینجا Coupling غیرضروری ایجاد می‌کند؟

اگر پاسخ‌ها نشان دهند که قابلیت قابل استفاده مجدد است:

> آن قابلیت باید به‌عنوان یک Module مستقل تعریف شود و مستقیماً داخل `SmartCoreServiceBusiness` قرار نگیرد.

---

# 68. هدف نهایی معماری

اکوسیستم باید بتواند چنین ساختاری داشته باشد:

```text
                    Reusable Platform
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   Service Business     Commerce         Marketplace
          │                │                │
          ▼                ▼                ▼
        Salon           Online Shop      Multi-Vendor
          │
          ▼
   Customer Deployment
```

با قابلیت‌های مشترک در لایه زیرین:

```text
Identity
Authorization
Organization
Localization
Finance
Communication
Scheduling
Resource
Workflow
Media
Audit
Event
```

در نتیجه ساخت محصول جدید باید عمدتاً با استفاده از:

```text
Configuration
+
Composition
+
Business Rules
+
Domain Extensions
```

انجام شود، نه با کپی کردن و بازنویسی Platform برای هر مشتری.