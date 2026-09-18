"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Business = exports.BusinessProfile = void 0;
const business_status_value_object_1 = require("../../shared/business-status.value-object");
const currency_value_object_1 = require("../../shared/currency.value-object");
const locale_value_object_1 = require("../../shared/locale.value-object");
const slug_value_object_1 = require("../../shared/slug.value-object");
const timezone_value_object_1 = require("../../shared/timezone.value-object");
const domain_error_1 = require("../../shared/domain-error");
const domain_events_1 = require("../../shared/domain-events");
class BusinessProfile {
    id;
    businessId;
    name;
    description;
    logoUrl;
    contactEmail;
    createdAt;
    updatedAt;
    constructor(input) {
        this.id = input.id ?? `profile-${Math.random().toString(36).slice(2, 11)}`;
        this.businessId = input.businessId;
        this.name = input.name;
        this.description = input.description;
        this.logoUrl = input.logoUrl;
        this.contactEmail = input.contactEmail;
        this.createdAt = input.createdAt ?? new Date();
        this.updatedAt = input.updatedAt ?? this.createdAt;
    }
    update(input) {
        if (input.name !== undefined)
            this.name = input.name;
        if (input.description !== undefined)
            this.description = input.description;
        if (input.logoUrl !== undefined)
            this.logoUrl = input.logoUrl;
        if (input.contactEmail !== undefined)
            this.contactEmail = input.contactEmail;
        this.updatedAt = new Date();
    }
}
exports.BusinessProfile = BusinessProfile;
class Business {
    id;
    organizationId;
    slug;
    defaultLocale;
    supportedLocales;
    timezone;
    currency;
    status;
    createdAt;
    updatedAt;
    deletedAt;
    profile;
    events = [];
    constructor(input) {
        this.id = input.id ?? `business-${Math.random().toString(36).slice(2, 11)}`;
        this.organizationId = input.organizationId;
        this.slug = slug_value_object_1.Slug.create(input.slug).toString();
        this.defaultLocale = locale_value_object_1.Locale.create(input.defaultLocale).toString();
        this.supportedLocales = input.supportedLocales.map((locale) => locale_value_object_1.Locale.create(locale).toString());
        if (!this.supportedLocales.includes(this.defaultLocale)) {
            throw new domain_error_1.ValidationError('Default locale must be included in supported locales.');
        }
        this.timezone = timezone_value_object_1.Timezone.create(input.timezone).toString();
        this.currency = currency_value_object_1.Currency.create(input.currency).toString();
        this.status = input.status ?? business_status_value_object_1.BusinessStatus.draft();
        this.createdAt = input.createdAt ?? new Date();
        this.updatedAt = input.updatedAt ?? this.createdAt;
        this.deletedAt = input.deletedAt;
        this.profile = input.profile;
        this.events.push(new domain_events_1.BusinessCreated(this.id, { slug: this.slug }));
    }
    static create(input, organizationId) {
        const businessId = `business-${Math.random().toString(36).slice(2, 11)}`;
        const profile = new BusinessProfile({
            businessId,
            name: input.profile.name,
            description: input.profile.description,
            logoUrl: input.profile.logoUrl,
            contactEmail: input.profile.contactEmail,
        });
        return new Business({
            id: businessId,
            organizationId,
            slug: input.slug,
            defaultLocale: input.defaultLocale,
            supportedLocales: input.supportedLocales,
            timezone: input.timezone,
            currency: input.currency,
            profile,
        });
    }
    updateProfile(input) {
        this.profile.update(input);
        this.updatedAt = new Date();
    }
    validateBusinessScope(organizationId) {
        if (this.organizationId !== organizationId) {
            throw new domain_error_1.ValidationError('Business access denied.');
        }
    }
}
exports.Business = Business;
