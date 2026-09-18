"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBusiness = mapBusiness;
exports.mapLocation = mapLocation;
exports.mapCategory = mapCategory;
exports.mapService = mapService;
exports.mapPolicy = mapPolicy;
function mapBusiness(value) {
    return {
        id: value.id,
        organizationId: value.organizationId,
        slug: value.slug,
        defaultLocale: value.defaultLocale,
        supportedLocales: [...value.supportedLocales],
        timezone: value.timezone,
        currency: value.currency,
        status: value.status.toString(),
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
        deletedAt: value.deletedAt,
        profile: value.profile ? {
            id: value.profile.id,
            businessId: value.profile.businessId,
            name: value.profile.name,
            description: value.profile.description,
            logoUrl: value.profile.logoUrl,
            contactEmail: value.profile.contactEmail,
            createdAt: value.profile.createdAt,
            updatedAt: value.profile.updatedAt,
        } : undefined,
    };
}
function mapLocation(value) {
    return { id: value.id, businessId: value.businessId, name: value.name, address: value.address, timezone: value.timezone, active: value.active, createdAt: value.createdAt, updatedAt: value.updatedAt };
}
function mapCategory(value) {
    return { id: value.id, businessId: value.businessId, name: value.name, slug: value.slug, parentCategoryId: value.parentCategoryId, active: value.active, createdAt: value.createdAt, updatedAt: value.updatedAt };
}
function mapService(value) {
    return { id: value.id, businessId: value.businessId, categoryId: value.categoryId, name: value.name, slug: value.slug, durationMinutes: value.durationMinutes, active: value.active, createdAt: value.createdAt, updatedAt: value.updatedAt };
}
function mapPolicy(value) {
    return { id: value.id, businessId: value.businessId, policyKey: value.policyKey, policyValueJson: value.policyValueJson, version: value.version, createdAt: value.createdAt, updatedAt: value.updatedAt };
}
