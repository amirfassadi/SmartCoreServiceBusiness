# Service Business Platform

> A modular, configurable platform for building digital solutions for service-based businesses.

**Service Business Platform** is a reusable and extensible platform designed to provide websites, booking systems, management tools, payments, notifications, and other digital services for different types of service businesses.

The platform is designed around a simple principle:

> **Build Once, Configure Many.**

Instead of building a separate application for every business, the platform provides a shared core, configurable modules, vertical-specific capabilities, and customizable themes.

The first implementation will target **Kimia Beauty Salon**, but the architecture is not limited to beauty salons.

---

## 🎯 Vision

The goal is to create a platform that can be configured and deployed for different service businesses with minimal custom development.

Examples include:

- 💇 Beauty Salons
- 💈 Barbershops
- 🚗 Auto Repair Shops
- 🦷 Clinics & Dental Offices
- 🧑‍⚕️ Healthcare Services
- 🏋️ Fitness & Personal Training
- 🧹 Home Services
- 🔧 Technical & Repair Services
- 📚 Training & Consultation Businesses
- ...and other appointment-based businesses

Each business can have its own:

- Brand
- Logo
- Colors
- Domain
- Services
- Staff
- Locations
- Working hours
- Booking rules
- Deposit/payment rules
- Enabled modules
- Content
- Gallery
- Notifications

without changing the platform's core business logic.

---

## 🏗️ Architecture

The platform is built around several major layers:

```text
┌─────────────────────────────────────────────┐
│                  Themes                     │
│     UI / Branding / Layout / Components     │
├─────────────────────────────────────────────┤
│               Public Website                │
│     Landing / Services / Gallery / Booking  │
├─────────────────────────────────────────────┤
│                 Modules                     │
│ Booking / Payment / SMS / Gallery / CRM ... │
├─────────────────────────────────────────────┤
│              Vertical Layer                 │
│ Beauty / Automotive / Clinic / Barbershop   │
├─────────────────────────────────────────────┤
│                  Core                       │
│ Business / Customer / Service / Staff /     │
│ Branch / Location / Appointment / etc.      │
├─────────────────────────────────────────────┤
│             Infrastructure                  │
│ Database / Cache / Storage / Providers      │
└─────────────────────────────────────────────┘
```

### Core

The Core contains domain concepts that are common to most service businesses.

Examples:

- Business / Tenant
- Branch
- Location
- Customer
- Service
- Staff / Service Provider
- Resource
- Working Hours
- Availability
- Appointment
- Payment
- Notification

The Core should remain independent from any specific business vertical.

---

## 🧩 Modular System

Features are implemented as modules that can be enabled or disabled depending on the business.

Potential modules include:

| Module | Description |
|---|---|
| Booking | Appointment scheduling |
| Payment | Online payments and deposits |
| Customer | Customer management |
| Staff | Staff and service providers |
| Services | Services and pricing |
| Gallery | Images and albums |
| Notifications | SMS, email and other notifications |
| SMS | SMS provider integration |
| Reviews | Customer reviews |
| CRM | Customer relationship management |
| Reports | Business reports and statistics |
| Multi-Branch | Multiple business locations |
| Resources | Rooms, equipment and other resources |
| Vehicles | Vehicle management for automotive businesses |

Modules should be loosely coupled and communicate through defined interfaces and events where appropriate.

---

## 🏢 Multi-Tenant Architecture

The platform is designed to support multiple businesses from the beginning.

Conceptually:

```text
Platform
│
├── Business A
│   ├── Branch 1
│   ├── Staff
│   ├── Services
│   └── Customers
│
├── Business B
│   ├── Branch 1
│   ├── Branch 2
│   ├── Staff
│   ├── Services
│   └── Customers
│
└── Business C
    └── ...
```

Each business can have independent configuration, data, branding, modules and operational rules.

This allows the project to evolve into a SaaS platform in the future.

---

## 📅 Booking & Appointment System

Booking is one of the central capabilities of the platform.

The system is intended to support:

- Service selection
- Staff selection
- Branch selection
- Date and time selection
- Availability checking
- Working hours
- Staff schedules
- Blocked time
- Resource availability
- Appointment conflict detection
- Booking confirmation
- Cancellation
- Rescheduling
- Deposit/payment requirements

### Deposit

Businesses can require a deposit before confirming an appointment.

Supported rules are intended to include:

```text
Deposit Type
├── Percentage
│   └── Example: 30%
│
└── Fixed Amount
    └── Example: 500,000 IRR
```

Payment processing is designed behind a provider abstraction so that different payment gateways can be integrated without changing the booking domain.

---

## 💳 Payment Architecture

Payment is treated as a generic platform capability rather than being tied to a specific payment provider.

Conceptually:

```text
Booking
   │
   ▼
Deposit Required?
   │
   ├── No ──► Confirm Appointment
   │
   └── Yes
         │
         ▼
     Payment
         │
         ▼
   Payment Provider
         │
    ┌────┴────┐
    ▼         ▼
 Success    Failed
    │
    ▼
Confirm Booking
```

The provider layer allows future integration with different payment gateways.

---

## 📍 Location & Branches

Businesses may operate from one or multiple locations.

Each branch can have:

- Address
- Geographic coordinates
- Phone number
- Working hours
- Services
- Staff
- Resources
- Booking rules

Although the initial MVP may use a single branch, the architecture is designed to support multiple branches.

---

## 👥 Staff & Service Providers

The platform supports staff members who provide services.

A staff member may have:

- Name
- Profile
- Contact information
- Services
- Working schedule
- Availability
- Branch assignment
- Appointment history

Different businesses can use different terminology.

For example:

```text
Beauty Salon
    → Stylist

Barbershop
    → Barber

Auto Repair
    → Technician

Clinic
    → Doctor
```

The core system therefore uses the generic concept of **Service Provider / Staff**.

---

## 🏷️ Services

Services are configurable per business.

A service may contain:

- Name
- Description
- Category
- Price
- Duration
- Staff availability
- Required resources
- Booking rules
- Deposit requirements
- Status

Example:

```text
Hair Services
├── Haircut
├── Coloring
├── Highlights
└── Hair Treatment
```

The same service engine can be used for completely different verticals.

---

## 🚗 Vertical-Specific Features

Not every business needs the same data model.

The platform therefore supports vertical-specific modules.

For example, an automotive business may enable a **Vehicles** module:

```text
Customer
   │
   ├── Vehicle
   │      ├── Make
   │      ├── Model
   │      ├── Year
   │      ├── VIN
   │      └── Service History
   │
   └── Appointments
```

A beauty salon may instead enable features such as:

```text
Customer
   │
   ├── Beauty Services
   ├── Appointment History
   └── Gallery / Preferences
```

The Core remains unchanged.

---

## 🎨 Themes & Branding

Business logic is separated from presentation.

Each business can have its own:

- Logo
- Brand colors
- Typography
- Layout
- Images
- Navigation
- Homepage sections
- Components
- Theme

Example:

```text
Platform
│
├── Business A
│   └── Theme: Elegant
│
├── Business B
│   └── Theme: Modern
│
└── Business C
    └── Theme: Minimal
```

This allows the same platform to produce visually different websites without duplicating business logic.

---

## 📱 Public Website

A configured business can expose a public website containing features such as:

- Homepage
- About
- Services
- Staff
- Gallery
- Branches
- Contact information
- Location/map
- Booking
- Customer reviews
- Social links

The exact pages and sections can depend on enabled modules and theme configuration.

---

## 🖼️ Gallery

Businesses can manage images and albums.

Potential capabilities:

- Albums
- Images
- Categories
- Cover images
- Ordering
- Visibility
- Object storage

Gallery functionality should be implemented independently from the website theme so that different themes can consume the same gallery data.

---

## 📲 Notifications

The platform will provide a generic notification layer.

Possible channels:

- SMS
- Email
- Push notifications
- WhatsApp or other messaging providers in the future

Examples:

```text
Appointment Created
        │
        ▼
Notification Event
        │
   ┌────┼────┐
   ▼    ▼    ▼
  SMS  Email Push
```

Provider integrations should be abstracted from business logic.

---

## 📡 SMS Providers

The platform will use an SMS provider abstraction.

For example:

```text
SMS Service
    │
    ├── Negar Provider
    ├── Provider B
    └── Provider C
```

The first implementation may use **Negar API**, but the core system should not depend directly on Negar.

---

## 🔐 Authentication & Authorization

The platform is intended to support:

- User authentication
- Business accounts
- Staff accounts
- Admin accounts
- Role-based access control
- Permissions
- Session/token management
- Audit logs

Example roles:

```text
Platform Admin
      │
      └── Business Owner
              │
              ├── Manager
              ├── Staff
              └── Receptionist
```

The exact permission model will evolve during implementation.

---

## 🖥️ Admin Panel

Each business should have access to an administration panel.

Potential sections:

```text
Dashboard
├── Appointments
├── Calendar
├── Customers
├── Services
├── Staff
├── Branches
├── Gallery
├── Payments
├── Notifications
├── Reports
└── Settings
```

The admin interface should be module-aware and only expose enabled functionality.

---

## 📊 Dashboard & Reporting

The platform is intended to provide operational insights such as:

- Today's appointments
- Upcoming appointments
- Completed appointments
- Cancelled appointments
- Revenue
- Deposits
- Popular services
- Staff performance
- Customer statistics

Reporting capabilities will expand as the platform matures.

---

## 🛠️ Proposed Technology Stack

The initial technology direction is:

### Frontend

- Next.js
- TypeScript
- React

### Backend

- NestJS
- TypeScript

### Database

- PostgreSQL

### Cache / Infrastructure

- Redis *(optional where needed)*

### File Storage

- S3-compatible object storage

### API

- REST API initially
- Event-driven architecture where appropriate

> The technology stack is a proposed direction and can be adjusted during implementation if technical requirements justify it.

---

## 📁 Repository Structure

The repository is expected to follow a modular structure similar to:

```text
service-business-platform/
│
├── apps/
│   ├── web/
│   ├── admin/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── config/
│   ├── types/
│   └── utils/
│
├── modules/
│   ├── booking/
│   ├── customers/
│   ├── services/
│   ├── staff/
│   ├── payments/
│   ├── notifications/
│   └── gallery/
│
├── verticals/
│   ├── beauty/
│   ├── automotive/
│   ├── barbershop/
│   └── clinic/
│
├── themes/
│   ├── default/
│   └── ...
│
├── docs/
│   └── SERVICE_BUSINESS_PLATFORM_SPEC.md
│
├── README.md
└── ...
```

The final structure may evolve during implementation.

---

## 🧱 Design Principles

The following principles are considered fundamental to the project.

### 1. Build Once, Configure Many

Avoid creating a separate application for every customer.

### 2. Generic Core

Core domain concepts must not depend on a specific vertical.

### 3. Modular Architecture

Features should be independently enableable where practical.

### 4. Configuration Over Custom Code

Business-specific behavior should preferably be controlled through configuration.

### 5. Provider Abstraction

External services such as:

- Payment gateways
- SMS providers
- Email providers
- Storage providers

must be replaceable without modifying the core business logic.

### 6. Theme Independence

Presentation should remain separate from domain logic.

### 7. Multi-Tenant Ready

The architecture should support multiple businesses without requiring a fundamental redesign.

### 8. Extensible Verticals

Adding a new type of service business should not require rewriting the Core.

---

## 🚀 First Implementation

The first implementation of the platform will be:

### Kimia Beauty Salon

Kimia is treated as the first **tenant / business implementation**, not as the definition of the platform itself.

The initial implementation is expected to demonstrate:

- Business configuration
- Branding
- Services
- Staff
- Location
- Gallery
- Appointment booking
- Deposit/payment
- Notifications
- Admin panel

Once the architecture is validated with Kimia, the same platform should be capable of supporting other service businesses.

---

## 🗺️ Development Roadmap

### Phase 1 — Foundation

- Repository setup
- Monorepo structure
- Core architecture
- Database
- Configuration system
- Authentication foundation

### Phase 2 — Business Core

- Business / Tenant
- Branch
- Location
- Services
- Staff
- Customers

### Phase 3 — Booking

- Availability
- Working hours
- Calendar
- Appointment lifecycle
- Conflict detection
- Booking workflow

### Phase 4 — Payments

- Deposit configuration
- Payment abstraction
- Payment gateway integration
- Payment status handling

### Phase 5 — Public Website

- Theme system
- Homepage
- Services
- Staff
- Gallery
- Location
- Booking UI

### Phase 6 — Notifications

- Notification engine
- SMS abstraction
- Negar integration
- Appointment notifications

### Phase 7 — Administration

- Admin dashboard
- Calendar
- Customer management
- Service management
- Staff management
- Reports

### Phase 8 — Multi-Vertical Expansion

- Barbershop
- Automotive
- Clinic
- Additional vertical modules

---

## 📋 Project Specification

The detailed functional and architectural specification is maintained separately:

```text
docs/SERVICE_BUSINESS_PLATFORM_SPEC.md
```

The specification is the primary reference for architectural decisions and project scope.

---

## 🔮 Future Possibilities

The long-term vision may include:

- SaaS subscription management
- Custom domains
- Multiple branches
- White-label deployments
- Advanced CRM
- Loyalty programs
- Discount and coupon systems
- Online invoicing
- Advanced analytics
- Marketing automation
- WhatsApp integration
- Mobile applications
- Customer self-service portal
- Staff mobile application
- Advanced resource management
- Marketplace capabilities

These features are not necessarily part of the initial MVP.

---

## 🧪 Current Status

> 🚧 **Early Development**

The project is currently in the architecture and specification stage.

The immediate priority is to finalize the architecture and MVP scope before beginning major implementation.

---

## 📄 License

License information will be added when the project's distribution and commercial model are finalized.

---

## 🤝 Contributing

Contribution guidelines will be added as the project structure and development workflow are established.

---

## 💡 Guiding Principle

This project is not intended to be just another booking website.

It is intended to become a **reusable platform for service businesses**.

```text
             SERVICE BUSINESS PLATFORM

                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Beauty        Automotive      Barbershop
        │              │              │
        └──────────────┼──────────────┘
                       │
                     Core
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Booking        Payment       Notification
        │              │              │
        └──────────────┼──────────────┘
                       │
                  Configuration
                       │
                     Theme
```

**One platform. Multiple businesses. Configurable modules. Independent branding.**