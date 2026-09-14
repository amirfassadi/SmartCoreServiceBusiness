# Service Business Platform
## Product & Technical Specification

**Version:** 0.2  
**Status:** Draft / Architecture & Requirements  
**Document:** `SERVICE_BUSINESS_PLATFORM_SPEC.md`

---

# 1. مقدمه

این پروژه یک پلتفرم نرم‌افزاری عمومی برای مدیریت کسب‌وکارهای خدماتی است.

هدف این نیست که فقط یک وب‌سایت برای یک سالن زیبایی ساخته شود؛ بلکه باید یک **هسته نرم‌افزاری قابل استفاده مجدد** ایجاد شود که بتوان آن را برای انواع کسب‌وکارهای خدماتی مختلف پیکربندی و عرضه کرد.

نمونه اولیه این سیستم، **سالن زیبایی کیمیا** خواهد بود.

اما معماری سیستم باید به‌گونه‌ای باشد که در آینده بتوان همان هسته را برای کسب‌وکارهایی مانند موارد زیر استفاده کرد:

- سالن زیبایی
- آرایشگاه مردانه
- تعمیرگاه خودرو
- کلینیک
- فیزیوتراپی
- پت‌شاپ و پت‌گرومینگ
- آتلیه
- آموزشگاه
- خدمات نظافتی
- مشاوره
- خدمات فنی
- و سایر کسب‌وکارهای مبتنی بر ارائه خدمات

اصل اصلی پروژه:

> **Build Once, Configure Many Times**

یعنی:

> یک بار هسته را بساز، برای کسب‌وکارهای مختلف پیکربندی کن.

---

# 2. چشم‌انداز محصول

سیستم باید بتواند یک کسب‌وکار خدماتی را از نظر موارد زیر مدیریت کند:

- معرفی عمومی کسب‌وکار
- خدمات
- قیمت خدمات
- کارکنان / ارائه‌دهندگان خدمات
- مشتریان
- شعب
- موقعیت مکانی
- ساعات کاری
- تقویم
- نوبت‌دهی
- رزرو آنلاین
- دریافت بیعانه
- پرداخت
- اعلان‌ها
- پیامک
- گالری
- مدیریت کاربران
- مدیریت محتوا
- مدیریت تنظیمات
- گزارش‌ها
- پنل مدیریت

و در عین حال اجازه دهد قابلیت‌های مختلف به صورت **Module** فعال یا غیرفعال شوند.

---

# 3. اصل معماری

سیستم باید از چند لایه مفهومی تشکیل شود:

```text
Platform Core
    │
    ├── Modules
    │
    ├── Vertical Configuration
    │
    ├── Tenant Configuration
    │
    ├── Theme
    │
    └── External Providers
```

### Platform Core

قابلیت‌هایی که تقریباً بین همه کسب‌وکارهای خدماتی مشترک هستند.

### Modules

قابلیت‌هایی که می‌توانند فعال یا غیرفعال شوند.

### Vertical

نوع کسب‌وکار.

مثلاً:

```text
beauty
barbershop
automotive
clinic
pet-grooming
```

### Tenant

هر کسب‌وکار واقعی که از سیستم استفاده می‌کند.

مثلاً:

```text
Kimia Beauty Salon
```

### Theme

ظاهر و هویت بصری کسب‌وکار.

### Provider

سرویس‌های خارجی مانند:

- SMS
- Payment Gateway
- Email
- Storage
- Maps

---

# 4. مدل مفهومی سیستم

موجودیت‌های اصلی سیستم:

```text
Business
 ├── Branch
 │    ├── Location
 │    ├── Working Hours
 │    └── Resources
 │
 ├── Services
 ├── Staff
 ├── Customers
 ├── Appointments
 ├── Payments
 ├── Notifications
 ├── Gallery
 └── Configuration
```

در کنار آن:

```text
Business
    │
    └── Vertical
          ├── Beauty
          ├── Automotive
          ├── Barbershop
          └── ...
```

---

# 5. Multi-Tenant Architecture

سیستم از ابتدا باید با مفهوم **Multi-Tenancy** طراحی شود.

هر کسب‌وکار یک Tenant خواهد بود.

مثال:

```text
Tenant A
Kimia Beauty Salon

Tenant B
Ali Barbershop

Tenant C
Miran Auto Service
```

اطلاعات Tenantها نباید با یکدیگر تداخل داشته باشد.

---

# 6. Business / Tenant

موجودیت Business اطلاعات اصلی کسب‌وکار را نگهداری می‌کند.

نمونه:

```text
Business
----------------
id
name
slug
vertical
logo
description
phone
email
website
status
created_at
updated_at
```

### نمونه

```yaml
business:
  name: "سالن زیبایی کیمیا"
  slug: "kimia-beauty"
  vertical: "beauty"
```

---

# 7. شعبه‌ها (Branches)

سیستم باید از ابتدا قابلیت چند شعبه‌ای شدن را در معماری داشته باشد.

حتی اگر نسخه MVP فقط یک شعبه داشته باشد، مدل داده نباید تک‌شعبه‌ای طراحی شود.

مثال:

```text
Kimia Beauty
│
├── Branch 1
│   └── Tehran
│
├── Branch 2
│   └── Karaj
│
└── Branch 3
    └── ...
```

هر شعبه می‌تواند داشته باشد:

- آدرس
- تلفن
- ساعات کاری
- کارکنان
- خدمات
- منابع
- تنظیمات
- موقعیت جغرافیایی

---

# 8. Location

اطلاعات مکانی یک بخش مهم و Core سیستم است.

هر Business یا Branch می‌تواند دارای Location باشد.

اطلاعات پیشنهادی:

```text
Location
----------------
country
province
city
district
address
postal_code
phone
latitude
longitude
map_url
```

### مثال

```yaml
location:
  country: "Iran"
  province: "Tehran"
  city: "Tehran"
  address: "..."
  postal_code: "..."
  latitude: 35.7
  longitude: 51.4
  map_url: "..."
```

در آینده می‌توان قابلیت‌های زیر را اضافه کرد:

- Google Maps
- OpenStreetMap
- نقشه‌های داخلی
- مسیریابی
- چند Location برای یک Business

---

# 9. Services

تمام کسب‌وکارهای هدف سیستم بر اساس Service قابل مدل‌سازی هستند.

مثال Beauty:

```text
Hair Color
Haircut
Makeup
Styling
```

مثال Automotive:

```text
Oil Change
Brake Service
Battery Replacement
Periodic Service
```

مدل عمومی:

```text
Service
----------------
id
business_id
branch_id
category_id
name
description
duration
price
currency
status
sort_order
```

---

# 10. Service Category

خدمات باید قابلیت دسته‌بندی داشته باشند.

مثلاً برای سالن زیبایی:

```text
Hair
 ├── Haircut
 ├── Coloring
 └── Styling

Makeup
 ├── Bridal
 └── Daily
```

برای تعمیرگاه:

```text
Engine
Brakes
Electrical
Maintenance
```

---

# 11. Service Configuration

هر Service می‌تواند تنظیمات خاص خود را داشته باشد.

مثلاً:

```yaml
service:
  name: "Hair Coloring"
  duration: 120
  price: 2500000
```

در آینده امکان موارد زیر وجود دارد:

- قیمت متغیر
- قیمت از ... تا ...
- نیاز به تأیید مدیر
- نیاز به Resource خاص
- نیاز به Staff خاص
- ظرفیت
- پیش‌نیاز
- تخفیف
- مالیات

---

# 12. Staff / Service Providers

در سیستم از مفهوم عمومی **Staff / Provider** استفاده می‌شود.

این مفهوم نباید فقط به آرایشگر محدود باشد.

Beauty:

```text
Hair Stylist
Colorist
Makeup Artist
```

Automotive:

```text
Mechanic
Electrician
Technician
```

Clinic:

```text
Doctor
Therapist
Assistant
```

مدل عمومی:

```text
Staff
----------------
id
business_id
branch_id
name
phone
email
avatar
bio
status
```

---

# 13. Staff و Services

هر Staff می‌تواند خدمات خاصی را ارائه دهد.

مثلاً:

```text
Sara
 ├── Haircut
 ├── Coloring
 └── Styling
```

اما:

```text
Mary
 ├── Makeup
 └── Bridal Makeup
```

بنابراین سیستم باید رابطه:

```text
Staff <-> Service
```

را پشتیبانی کند.

---

# 14. Working Hours

ساعات کاری باید قابل تعریف باشد.

مثال:

```text
Saturday
09:00 - 18:00

Sunday
09:00 - 18:00

Monday
09:00 - 18:00
```

همچنین باید امکان موارد زیر وجود داشته باشد:

- روز تعطیل
- تعطیلات مناسبتی
- تعطیلی موقت
- ساعات کاری متفاوت
- Break
- ساعات کاری هر شعبه
- ساعات کاری هر Staff

---

# 15. Availability

Availability یکی از بخش‌های مهم سیستم رزرو است.

سیستم باید بتواند مشخص کند چه زمان‌هایی قابل رزرو هستند.

Availability می‌تواند تحت تأثیر موارد زیر باشد:

```text
Business Working Hours
+
Branch Working Hours
+
Staff Schedule
+
Resource Availability
+
Existing Appointments
+
Blocked Time
+
Service Duration
```

مثلاً اگر یک سرویس 90 دقیقه طول می‌کشد:

```text
14:00 - 15:30
```

باید فقط در صورتی پیشنهاد شود که کل بازه آزاد باشد.

---

# 16. Resources

برای جلوگیری از محدود شدن سیستم به یک نوع کسب‌وکار، مفهوم Resource باید عمومی باشد.

Resource می‌تواند شامل مواردی مانند:

Beauty:

```text
Chair
Room
Hair Wash Station
```

Automotive:

```text
Service Bay
Lift
Diagnostic Device
```

Clinic:

```text
Treatment Room
Medical Device
```

بنابراین:

```text
Resource
----------------
id
business_id
branch_id
name
type
status
```

می‌تواند در آینده به Service و Appointment متصل شود.

---

# 17. Appointment

Appointment یکی از Core Entityهای سیستم است.

مدل مفهومی:

```text
Appointment
----------------
id
business_id
branch_id
customer_id
service_id
staff_id
resource_id
start_at
end_at
status
price
deposit_amount
payment_status
notes
created_at
updated_at
```

---

# 18. Appointment Status

وضعیت‌های پیشنهادی:

```text
pending
awaiting_payment
confirmed
completed
cancelled
rejected
no_show
```

در آینده می‌توان وضعیت‌های بیشتری اضافه کرد.

---

# 19. Booking Flow

رزرو باید به صورت Workflow طراحی شود.

نمونه:

```text
Customer
   ↓
Select Service
   ↓
Select Branch
   ↓
Select Staff
   ↓
Select Date
   ↓
Select Time
   ↓
Enter Customer Information
   ↓
Calculate Price
   ↓
Calculate Deposit
   ↓
Payment
   ↓
Payment Verification
   ↓
Appointment Confirmation
   ↓
SMS / Notification
```

---

# 20. Deposit / بیعانه

بیعانه یکی از قابلیت‌های اصلی سیستم رزرو است.

بیعانه نباید مخصوص سالن زیبایی باشد؛ بلکه باید به صورت Generic طراحی شود.

تنظیمات نمونه:

```yaml
booking:
  deposit:
    enabled: true
    type: percentage
    value: 20
```

یعنی:

> 20 درصد مبلغ رزرو باید پرداخت شود.

یا:

```yaml
booking:
  deposit:
    enabled: true
    type: fixed
    value: 500000
```

یعنی:

> مبلغ ثابت 500,000 به عنوان بیعانه دریافت شود.

---

# 21. Payment

Payment باید یک Module مستقل باشد.

مدل عمومی:

```text
Payment
----------------
id
business_id
appointment_id
customer_id
amount
currency
type
status
provider
transaction_id
reference_id
created_at
paid_at
```

Payment Type می‌تواند شامل موارد زیر باشد:

```text
deposit
full_payment
refund
additional_payment
```

---

# 22. Payment Provider

سیستم نباید مستقیماً به یک درگاه پرداخت خاص وابسته شود.

باید یک Interface عمومی برای Payment Provider وجود داشته باشد.

مثلاً:

```text
PaymentProvider
    ├── createPayment()
    ├── verifyPayment()
    ├── refund()
    └── getPaymentStatus()
```

در آینده می‌توان Providerهای مختلف اضافه کرد.

مثلاً:

```text
Zarinpal
IDPay
Stripe
PayPal
LocalBank
...
```

بدون تغییر Core سیستم.

---

# 23. Payment Workflow

نمونه:

```text
Create Appointment
       ↓
Calculate Deposit
       ↓
Create Payment
       ↓
Redirect to Gateway
       ↓
Customer Pays
       ↓
Gateway Callback
       ↓
Verify Payment
       ↓
Mark Payment Paid
       ↓
Confirm Appointment
       ↓
Send Notification
```

اگر پرداخت ناموفق باشد:

```text
Appointment
    ↓
awaiting_payment
```

و رزرو نباید به صورت قطعی تأیید شود.

---

# 24. Payment Expiration

برای جلوگیری از رزروهای بدون پرداخت، سیستم باید بتواند Payment Timeout داشته باشد.

مثلاً:

```yaml
booking:
  payment_timeout_minutes: 15
```

اگر مشتری در 15 دقیقه پرداخت نکند:

```text
Appointment → expired/cancelled
```

و Slot دوباره آزاد شود.

---

# 25. Customer

مشتری یک Entity عمومی است.

```text
Customer
----------------
id
business_id
first_name
last_name
phone
email
notes
status
created_at
```

اطلاعات حساس باید با رعایت امنیت نگهداری شوند.

---

# 26. Customer History

سیستم باید بتواند تاریخچه مشتری را نگهداری کند.

مثلاً:

```text
Customer
   │
   ├── Appointments
   ├── Payments
   ├── Services
   └── Notifications
```

در آینده:

- خریدها
- تخفیف‌ها
- Loyalty
- اعتبار
- تیکت‌ها

نیز می‌توانند اضافه شوند.

---

# 27. Vertical-specific Data

اطلاعاتی که مخصوص یک نوع کسب‌وکار هستند نباید وارد Core شوند.

مثلاً:

### Automotive

مفهوم:

```text
Vehicle
```

برای:

```text
Customer
   ↓
Vehicle
   ↓
Appointment
```

اطلاعات خودرو:

```text
brand
model
year
plate
VIN
mileage
```

این بخش باید به عنوان یک Module / Vertical Feature پیاده‌سازی شود.

---

# 28. نمونه Verticalها

## Beauty

```text
Core
+
Services
+
Staff
+
Appointments
+
Payments
+
Gallery
```

## Barbershop

```text
Core
+
Services
+
Staff
+
Appointments
+
Payments
```

## Automotive

```text
Core
+
Services
+
Staff
+
Appointments
+
Payments
+
Vehicles
```

## Clinic

```text
Core
+
Services
+
Providers
+
Appointments
+
Payments
+
Patient-related modules
```

نکته:

> Core نباید برای هیچ Vertical خاصی طراحی شود.

---

# 29. Module System

سیستم باید دارای معماری Module-based باشد.

نمونه:

```yaml
modules:
  booking: true
  payments: true
  sms: true
  gallery: true
  customers: true
  staff: true
  vehicles: false
```

هر Tenant می‌تواند Moduleهای مورد نیاز خود را فعال کند.

---

# 30. Core Modules

Moduleهای پایه پیشنهادی:

```text
core
business
branches
locations
services
staff
customers
appointments
```

---

# 31. Optional Modules

نمونه Moduleهای اختیاری:

```text
booking
payments
sms
email
gallery
reviews
discounts
loyalty
invoices
reports
vehicles
inventory
subscriptions
```

---

# 32. Module Dependency

Moduleها ممکن است Dependency داشته باشند.

مثلاً:

```text
Payments
    ↓
Booking
```

یا:

```text
SMS
    ↓
Appointments
```

سیستم باید Dependencyها را کنترل کند.

مثلاً فعال کردن:

```text
Deposit
```

بدون:

```text
Payments
```

نباید مجاز باشد.

---

# 33. Configuration

تنظیمات باید تا حد ممکن از Code جدا باشند.

مثلاً:

```yaml
business:
  name: "سالن زیبایی کیمیا"

booking:
  enabled: true

payments:
  enabled: true

sms:
  enabled: true

gallery:
  enabled: true

theme:
  name: "modern-beauty"
```

---

# 34. Theme System

ظاهر سیستم باید از Business Logic جدا باشد.

Theme مسئول:

- رنگ‌ها
- فونت
- Layout
- Header
- Footer
- Hero
- Cards
- Buttons
- Gallery
- Service display

است.

---

# 35. Branding

هر Business باید بتواند Branding خودش را داشته باشد.

مثلاً:

```yaml
branding:
  logo: "/..."
  favicon: "/..."
  primary_color: "#..."
  secondary_color: "#..."
  font: "..."
```

موارد احتمالی:

- Logo
- Favicon
- رنگ اصلی
- رنگ ثانویه
- فونت
- تصاویر
- Banner
- شعار

---

# 36. Public Website

هر Business باید بتواند یک وب‌سایت عمومی داشته باشد.

ساختار پیشنهادی:

```text
/
├── Home
├── Services
├── Staff
├── Gallery
├── About
├── Location
├── Contact
└── Booking
```

البته صفحات باید وابسته به Module باشند.

مثلاً اگر Gallery فعال نیست:

```text
/gallery
```

نباید نمایش داده شود.

---

# 37. Homepage

Homepage باید Configurable باشد.

نمونه بخش‌ها:

```text
Hero
Services
About
Staff
Gallery
Testimonials
Location
Contact
CTA Booking
```

ترتیب و فعال بودن بخش‌ها می‌تواند از Theme/Configuration کنترل شود.

---

# 38. Gallery

Gallery یک Module عمومی است.

برای Beauty:

```text
Hair
Makeup
Nails
Before / After
```

برای Automotive:

```text
Workshop
Repair
Projects
```

Gallery نباید به Beauty وابسته باشد.

---

# 39. Media Storage

فایل‌ها باید از Database جدا نگهداری شوند.

پیشنهاد:

```text
Object Storage
```

با امکان استفاده از:

- S3
- S3-compatible storage
- Cloud Storage
- Local Storage در Development

---

# 40. SMS

SMS یک Provider-based Module خواهد بود.

نباید Core مستقیماً به یک شرکت SMS وابسته باشد.

Interface پیشنهادی:

```text
SmsProvider
    ├── send()
    ├── sendTemplate()
    └── getStatus()
```

---

# 41. SMS Provider

در اولین نسخه می‌توان یک Provider ایرانی مانند Negar API را پیاده‌سازی کرد.

اما ساختار باید به شکل زیر باشد:

```text
SMS Module
    │
    └── SmsProvider
          ├── Negar
          ├── Provider B
          └── Provider C
```

بنابراین تغییر سرویس‌دهنده SMS نیازمند تغییر Core نخواهد بود.

---

# 42. SMS Events

رویدادهای پیشنهادی:

```text
AppointmentCreated
AppointmentConfirmed
PaymentReceived
AppointmentCancelled
AppointmentReminder
```

مثلاً:

```text
PaymentReceived
       ↓
SMS
       ↓
"پرداخت شما با موفقیت انجام شد."
```

---

# 43. Notification Architecture

در آینده Notification باید چند کاناله باشد.

```text
Notification
    ├── SMS
    ├── Email
    ├── Push
    └── WhatsApp
```

در MVP ممکن است فقط SMS فعال باشد.

---

# 44. Admin Panel

هر Business باید یک Admin Panel داشته باشد.

بخش‌های پیشنهادی:

```text
Dashboard

Business
Branches
Locations

Services
Categories

Staff

Customers

Appointments
Calendar

Payments

Gallery

Notifications

Reports

Settings

Modules
Theme
Branding
```

---

# 45. Dashboard

Dashboard باید خلاصه وضعیت Business را نمایش دهد.

مثلاً:

```text
Today's Appointments
Today's Revenue
Pending Appointments
Pending Payments
New Customers
```

در آینده:

- نمودار فروش
- محبوب‌ترین خدمات
- عملکرد Staff
- نرخ لغو
- نرخ No-show

---

# 46. Calendar

Calendar باید یکی از بخش‌های اصلی Admin باشد.

امکانات:

- Day View
- Week View
- Month View
- فیلتر Staff
- فیلتر Branch
- فیلتر Service
- ایجاد Appointment
- تغییر Appointment
- لغو
- Block Time

---

# 47. Roles & Permissions

سیستم باید Role-based Access Control داشته باشد.

نمونه:

```text
Super Admin
Business Owner
Branch Manager
Staff
Receptionist
Accountant
```

Permissions:

```text
appointments.read
appointments.create
appointments.update
appointments.cancel

customers.read
customers.update

payments.read
payments.refund

services.manage
staff.manage
settings.manage
```

---

# 48. Authentication

سیستم باید Authentication امن داشته باشد.

روش‌های احتمالی:

```text
Email + Password
Phone + OTP
Social Login
```

روش نهایی بعد از انتخاب Stack مشخص خواهد شد.

---

# 49. API Architecture

Backend باید API محور طراحی شود.

مثلاً:

```text
/api/v1/businesses
/api/v1/branches
/api/v1/services
/api/v1/staff
/api/v1/customers
/api/v1/appointments
/api/v1/payments
/api/v1/gallery
```

API باید:

- Versioned
- Authenticated
- Validated
- Documented

باشد.

---

# 50. Event-driven Architecture

برای بخش‌هایی مانند Payment و Notification بهتر است سیستم Event-based باشد.

مثلاً:

```text
AppointmentConfirmed
        ↓
Event Bus
        ├── SMS
        ├── Email
        └── Analytics
```

این کار باعث می‌شود Moduleها coupling کمتری داشته باشند.

---

# 51. Database

Database باید Relational باشد.

گزینه پیشنهادی اولیه:

```text
PostgreSQL
```

اما این تصمیم در مرحله طراحی نهایی تکنولوژی قطعی خواهد شد.

---

# 52. Object Storage

برای فایل‌هایی مانند:

- عکس
- ویدئو
- لوگو
- گالری
- فایل‌های مشتری

از Object Storage استفاده شود.

---

# 53. Cache

در صورت نیاز:

```text
Redis
```

می‌تواند برای موارد زیر استفاده شود:

- Session
- Cache
- Rate limiting
- Queue
- Temporary booking locks
- OTP

استفاده از Redis در MVP باید بر اساس نیاز واقعی تصمیم‌گیری شود.

---

# 54. Booking Concurrency

یکی از مشکلات مهم سیستم‌های رزرو، رزرو همزمان یک Slot توسط چند کاربر است.

مثال:

```text
User A → 15:00
User B → 15:00
```

سیستم باید فقط یکی را تأیید کند.

برای این موضوع باید از مکانیزم‌هایی مانند:

- Database transaction
- Row locking
- Unique constraints
- Temporary booking lock

استفاده شود.

---

# 55. Security

امنیت از ابتدا باید در معماری لحاظ شود.

موارد مهم:

- Authentication
- Authorization
- Password hashing
- Input validation
- Rate limiting
- CSRF protection در صورت نیاز
- XSS protection
- SQL Injection prevention
- Secure cookies/tokens
- Audit logs
- Secure payment callbacks

---

# 56. Audit Log

عملیات مهم مدیریتی باید قابل ثبت باشند.

مثلاً:

```text
Who
What
When
Where
```

نمونه:

```text
Admin Amir
changed
Service Price
from 1,000,000
to 1,200,000
```

---

# 57. Logging

سیستم باید Logging استاندارد داشته باشد.

سطوح:

```text
DEBUG
INFO
WARNING
ERROR
CRITICAL
```

و در Production باید از ثبت اطلاعات حساس جلوگیری شود.

---

# 58. Reporting

Reporting در ابتدا می‌تواند ساده باشد.

گزارش‌های آینده:

```text
Revenue
Appointments
Customers
Services
Staff Performance
Payments
Cancellations
No Shows
```

---

# 59. SEO

Public Website باید قابلیت SEO داشته باشد.

موارد:

- Meta Title
- Meta Description
- Open Graph
- Sitemap
- Robots
- Structured Data
- Canonical URL

---

# 60. Domain / URL

هر Business می‌تواند یک URL داشته باشد.

مثلاً:

```text
kimia.example.com
```

یا در آینده:

```text
example.com/kimia
```

و حتی Domain اختصاصی:

```text
www.kimia-salon.ir
```

این بخش باید در معماری Multi-Tenant در نظر گرفته شود.

---

# 61. Internationalization

سیستم بهتر است از ابتدا قابلیت چندزبانه شدن داشته باشد.

مثلاً:

```text
fa
en
tr
```

و همچنین:

- RTL
- LTR
- Currency
- Date format
- Timezone

باید قابل تنظیم باشند.

---

# 62. Localization

هر Business باید بتواند تنظیمات منطقه‌ای خودش را داشته باشد.

مثلاً:

```yaml
localization:
  language: "fa"
  timezone: "Asia/Tehran"
  currency: "IRR"
  calendar: "jalali"
```

این موضوع برای استفاده بین‌المللی سیستم بسیار مهم است.

---

# 63. Pricing Model

در آینده خود پلتفرم نیز می‌تواند مدل تجاری داشته باشد.

مثلاً:

```text
Free
Basic
Professional
Enterprise
```

و هر Plan می‌تواند Moduleهای خاصی داشته باشد.

مثلاً:

```text
Basic
    Booking
    Customers
    Services

Professional
    Booking
    Payments
    SMS
    Reports

Enterprise
    Multi Branch
    Advanced Reports
    API
    Custom Domain
```

این موضوع در MVP لازم نیست پیاده‌سازی شود اما معماری نباید مانع آن باشد.

---

# 64. Tenant Configuration

Configuration هر Tenant باید جداگانه باشد.

مثال:

```yaml
tenant:
  name: "Kimia Beauty"

modules:
  booking: true
  payments: true
  sms: true
  gallery: true
  vehicles: false

theme:
  name: "beauty-modern"

booking:
  deposit:
    enabled: true
    type: percentage
    value: 20
```

---

# 65. Vertical Configuration

Vertical نیز می‌تواند Configuration داشته باشد.

مثلاً:

```yaml
vertical:
  id: "automotive"
```

و Module مربوط به Vehicle فعال شود.

---

# 66. Separation of Concerns

یکی از مهم‌ترین اصول پروژه:

```text
Business Logic
≠
Presentation
≠
Theme
≠
Provider
≠
Vertical
```

نباید کدهای مربوط به این بخش‌ها با هم ترکیب شوند.

---

# 67. Provider Abstraction

هر سرویس خارجی باید از طریق Interface متصل شود.

مثلاً:

```text
PaymentProvider
SmsProvider
StorageProvider
EmailProvider
MapProvider
```

هدف:

> تغییر Provider بدون تغییر Business Logic.

---

# 68. Proposed Technology Stack

در این نسخه هنوز Stack نهایی قطعی نیست.

گزینه پیشنهادی اولیه:

### Frontend

```text
Next.js
TypeScript
```

### Backend

```text
NestJS
TypeScript
```

### Database

```text
PostgreSQL
```

### Cache / Queue

```text
Redis
```

### Storage

```text
S3-compatible Object Storage
```

اما انتخاب نهایی باید بعد از بررسی موارد زیر انجام شود:

- پیچیدگی پروژه
- سرعت توسعه
- قابلیت نگهداری
- هزینه Deployment
- تجربه تیم
- Scalability
- نیازهای Multi-Tenant
- نیازهای SEO
- نیازهای آینده

---

# 69. چرا TypeScript گزینه مهمی است؟

با توجه به اینکه Frontend و Backend می‌توانند با TypeScript توسعه داده شوند، امکان اشتراک Typeها و مدل‌های API وجود دارد.

مثلاً:

```text
Frontend
    ↓
Shared Types
    ↓
Backend
```

که می‌تواند خطاهای مربوط به Contract بین Frontend و Backend را کاهش دهد.

البته این موضوع هنوز یک تصمیم نهایی نیست.

---

# 70. ساختار احتمالی Repository

ساختار پیشنهادی اولیه:

```text
service-business-platform/
│
├── apps/
│   ├── web/
│   ├── admin/
│   └── api/
│
├── packages/
│   ├── core/
│   ├── database/
│   ├── modules/
│   ├── ui/
│   ├── types/
│   └── config/
│
├── verticals/
│   ├── beauty/
│   ├── barbershop/
│   └── automotive/
│
├── themes/
│   ├── default/
│   ├── beauty/
│   └── modern/
│
├── docs/
│
└── README.md
```

این ساختار صرفاً پیشنهادی است و قبل از شروع Development نهایی خواهد شد.

---

# 71. Kimia Beauty Salon

اولین Implementation سیستم:

```text
Vertical:
beauty

Tenant:
Kimia Beauty Salon
```

Moduleهای احتمالی:

```yaml
modules:
  services: true
  staff: true
  customers: true
  booking: true
  payments: true
  deposit: true
  sms: true
  gallery: true
  reviews: true
  reports: true
```

---

# 72. نمونه Automotive

برای یک تعمیرگاه:

```yaml
business:
  name: "Miran Auto Service"

vertical:
  id: "automotive"

modules:
  services: true
  staff: true
  customers: true
  booking: true
  payments: true
  sms: true
  vehicles: true
  gallery: false
```

در این حالت:

```text
Vehicle
```

به سیستم اضافه می‌شود، بدون اینکه Core تغییر اساسی کند.

---

# 73. MVP

MVP باید کوچک ولی معماری آن قابل توسعه باشد.

پیشنهاد MVP:

```text
Core
Business
Branch
Location
Services
Staff
Customers
Booking
Appointments
Working Hours
Admin Panel
Public Website
Payments
Deposit
Basic SMS
Theme
Configuration
```

---

# 74. MVP User Flow

### Customer

```text
Website
   ↓
Services
   ↓
Choose Service
   ↓
Choose Staff
   ↓
Choose Date/Time
   ↓
Enter Phone
   ↓
Pay Deposit
   ↓
Booking Confirmed
```

### Admin

```text
Login
   ↓
Dashboard
   ↓
Calendar
   ↓
Appointments
   ↓
Customers
   ↓
Services
   ↓
Staff
   ↓
Payments
   ↓
Settings
```

---

# 75. مراحل توسعه

## Phase 1 — Architecture

- Finalize Domain Model
- Finalize Module System
- Finalize Tenant Model
- Finalize Vertical Model
- Finalize API Strategy
- Finalize Technology Stack

## Phase 2 — Core

- Authentication
- Business
- Branch
- Location
- Users
- Roles

## Phase 3 — Services

- Services
- Categories
- Staff
- Working Hours

## Phase 4 — Booking

- Availability
- Appointment
- Calendar
- Booking Flow
- Conflict Handling

## Phase 5 — Payment

- Payment abstraction
- Deposit
- Gateway
- Verification
- Payment status

## Phase 6 — Website

- Theme
- Branding
- Homepage
- Services
- Staff
- Location
- Booking

## Phase 7 — Notifications

- SMS Provider
- Templates
- Appointment notifications

## Phase 8 — Kimia

- Beauty Vertical
- Theme
- Sample Data
- Deployment

---

# 76. Future Modules

پس از MVP:

```text
Reviews
Discounts
Coupons
Loyalty
Invoices
Advanced Reports
Inventory
Products
Subscriptions
Membership
Gift Cards
WhatsApp
Email Marketing
Push Notifications
CRM
Accounting
Multi-language
Custom Domain
Mobile App
```

---

# 77. Future Vertical Modules

نمونه:

### Automotive

```text
Vehicles
Service History
Mileage
Parts
Inventory
```

### Beauty

```text
Beauty Packages
Membership
Before/After
Products
```

### Clinic

```text
Patient
Medical Record
Treatment
Prescription
```

این اطلاعات نباید به Core تحمیل شوند.

---

# 78. اصولی که نباید نقض شوند

### اصل 1

Core نباید Beauty-specific باشد.

### اصل 2

Core نباید Automotive-specific باشد.

### اصل 3

Theme نباید Business Logic داشته باشد.

### اصل 4

Provider خارجی نباید مستقیماً وارد Domain Logic شود.

### اصل 5

Moduleها باید مستقل و قابل فعال/غیرفعال شدن باشند.

### اصل 6

Multi-Tenant از ابتدا در طراحی لحاظ شود.

### اصل 7

Multi-Branch از ابتدا در مدل داده لحاظ شود.

### اصل 8

Payment و Deposit باید Generic باشند.

### اصل 9

Location باید بخشی از Core باشد.

### اصل 10

Vertical-specific functionality باید از Core جدا باشد.

---

# 79. معیار موفقیت معماری

معماری زمانی موفق محسوب می‌شود که بتوانیم بعد از ساخت MVP، یک کسب‌وکار جدید را با حداقل تغییر در Core اضافه کنیم.

مثلاً:

```text
Kimia Beauty
```

به:

```text
Miran Auto Service
```

تبدیل نشود؛ بلکه یک Tenant جدید باشد که:

```text
Core
+
Automotive Vertical
+
Automotive Theme
+
Configuration
```

دریافت می‌کند.

---

# 80. سناریوی ایده‌آل

هدف نهایی این است:

```text
Platform
│
├── Business A
│   ├── Beauty
│   ├── Theme A
│   └── Modules
│
├── Business B
│   ├── Automotive
│   ├── Theme B
│   └── Modules
│
├── Business C
│   ├── Barbershop
│   ├── Theme C
│   └── Modules
│
└── Business D
    ├── Clinic
    ├── Theme D
    └── Modules
```

بدون اینکه برای هر Business یک پروژه کاملاً جدا ساخته شود.

---

# 81. Definition of Done برای MVP

MVP زمانی آماده محسوب می‌شود که:

- Business قابل ایجاد باشد.
- Location قابل تعریف باشد.
- Service قابل ایجاد باشد.
- Staff قابل تعریف باشد.
- Working Hours قابل تنظیم باشد.
- Customer بتواند سرویس انتخاب کند.
- Customer بتواند Slot انتخاب کند.
- سیستم Availability را بررسی کند.
- Appointment ایجاد شود.
- Deposit محاسبه شود.
- Payment انجام شود.
- Payment Verify شود.
- Appointment تأیید شود.
- SMS ارسال شود.
- Admin بتواند Appointment را مدیریت کند.
- Public Website قابل مشاهده باشد.
- Theme قابل تغییر باشد.
- Moduleها قابل فعال/غیرفعال شدن باشند.
- سیستم برای Tenantهای مختلف قابل استفاده باشد.

---

# 82. مواردی که هنوز باید با هم تصمیم‌گیری شوند

در این مرحله موارد زیر عمداً قطعی نشده‌اند:

## Technology

- Next.js یا گزینه دیگر
- NestJS یا گزینه دیگر
- Monorepo یا چند Repository
- REST یا GraphQL
- ORM مورد استفاده
- Authentication Strategy

## Deployment

- VPS
- Cloud
- Docker
- Managed Database
- Object Storage

## Payment

- اولین Payment Provider
- روش Callback
- Refund Policy

## SMS

- Negar API
- Providerهای دیگر
- Template System

## UI

- Design System
- Component Library
- Theme Architecture

## Multi-Tenancy

- Shared Database / Shared Schema
- Shared Database / Separate Schema
- Database per Tenant

این موارد باید بعد از نهایی شدن Domain و Module Architecture بررسی و انتخاب شوند.

---

# 83. تصمیم مهم فعلی

در این نسخه یک تصمیم معماری مهم گرفته شده است:

> این پروژه «Beauty Salon Platform» نیست.

نام مفهومی پروژه:

# Service Business Platform

است.

و:

> **Kimia Beauty Salon اولین Tenant / Vertical Implementation است.**

---

# 84. فلسفه پروژه

این پروژه نباید بر اساس این سؤال طراحی شود:

> «چطور یک سایت برای سالن کیمیا بسازیم؟»

بلکه باید بر اساس این سؤال طراحی شود:

> «چطور یک پلتفرم بسازیم که بتواند سایت و سیستم مدیریت سالن کیمیا، آرایشگاه، تعمیرگاه و سایر کسب‌وکارهای خدماتی را با یک Core مشترک ایجاد و مدیریت کند؟»

---

# 85. Guiding Principle

اصل راهنمای کل پروژه:

> **Build Once. Configure Many. Extend by Modules.**

یعنی:

**یک بار بساز.**

**برای کسب‌وکارهای مختلف پیکربندی کن.**

**قابلیت‌های جدید را با Module اضافه کن.**

---

# 86. وضعیت فعلی پروژه

```text
Specification
    ↓
Version 0.2
    ↓
Domain Architecture Defined
    ↓
Module Architecture Defined
    ↓
Vertical Architecture Defined
    ↓
Technology Selection → NEXT
    ↓
Database Design → NEXT
    ↓
API Design → NEXT
    ↓
UI / UX Design → NEXT
    ↓
Implementation
```

---

# 87. مرحله بعد

قبل از شروع کدنویسی پیشنهاد می‌شود ابتدا این موارد را با هم نهایی کنیم:

### 1. Domain Model

تمام Entityها و ارتباطات آنها.

### 2. Module System

دقیقاً چه چیزی Core است و چه چیزی Module.

### 3. Vertical System

نحوه پیاده‌سازی Beauty، Automotive و سایر Verticalها.

### 4. Multi-Tenant Strategy

نحوه جداسازی اطلاعات Businessها.

### 5. Technology Stack

انتخاب نهایی:

```text
Frontend
Backend
Database
ORM
Authentication
Storage
Cache
Queue
Deployment
```

### 6. Repository Architecture

ساختار نهایی پروژه.

### 7. Database Schema

طراحی جداول و روابط.

### 8. API Contract

Endpointها و مدل‌های Request/Response.

بعد از نهایی شدن این موارد، می‌توان وارد Implementation شد.

---

# 88. نتیجه

نسخه 0.2 پروژه را از یک Website مخصوص سالن زیبایی به یک **پلتفرم عمومی برای کسب‌وکارهای خدماتی** تبدیل می‌کند.

معماری هدف:

```text
                 Service Business Platform
                           │
              ┌────────────┴────────────┐
              │                         │
             Core                    Modules
              │                         │
       ┌──────┼──────┐          ┌───────┼────────┐
       │      │      │          │       │        │
    Business Service Staff    Booking Payment    SMS
       │      │      │          │       │        │
     Branch Customer           Deposit  Gateway
       │
    Location
       │
   Working Hours
       │
   Availability
       │
  Appointments
              │
              ▼
          Verticals
              │
      ┌───────┼────────┐
      │       │        │
    Beauty Automotive Barbershop
      │       │        │
    Kimia    Vehicles   ...
              │
              ▼
            Themes
```

این معماری باید امکان دهد یک محصول واحد ساخته شود که برای هر کسب‌وکار با ترکیب زیر قابل ارائه باشد:

```text
Core
+
Selected Modules
+
Vertical
+
Theme
+
Configuration
+
External Providers
```

و این ترکیب، اساس محصول نهایی خواهد بود.