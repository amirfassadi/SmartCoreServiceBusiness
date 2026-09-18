import { Business } from '../../domain/business/entities/business.entity';
import { BusinessLocation } from '../../domain/business-location/entities/business-location.entity';
import { ServiceCategory } from '../../domain/service-category/entities/service-category.entity';
import { Service } from '../../domain/service/entities/service.entity';
import { BusinessPolicy } from '../../domain/business-policy/entities/business-policy.entity';

export function mapBusiness(value: Business) {
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

export function mapLocation(value: BusinessLocation) {
  return { id: value.id, businessId: value.businessId, name: value.name, address: value.address, timezone: value.timezone, active: value.active, createdAt: value.createdAt, updatedAt: value.updatedAt };
}

export function mapCategory(value: ServiceCategory) {
  return { id: value.id, businessId: value.businessId, name: value.name, slug: value.slug, parentCategoryId: value.parentCategoryId, active: value.active, createdAt: value.createdAt, updatedAt: value.updatedAt };
}

export function mapService(value: Service) {
  return { id: value.id, businessId: value.businessId, categoryId: value.categoryId, name: value.name, slug: value.slug, durationMinutes: value.durationMinutes, active: value.active, createdAt: value.createdAt, updatedAt: value.updatedAt };
}

export function mapPolicy(value: BusinessPolicy) {
  return { id: value.id, businessId: value.businessId, policyKey: value.policyKey, policyValueJson: value.policyValueJson, version: value.version, createdAt: value.createdAt, updatedAt: value.updatedAt };
}
