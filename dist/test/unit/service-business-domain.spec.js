"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const business_entity_1 = require("../../src/domain/business/entities/business.entity");
const business_status_value_object_1 = require("../../src/domain/shared/business-status.value-object");
const locale_value_object_1 = require("../../src/domain/shared/locale.value-object");
const slug_value_object_1 = require("../../src/domain/shared/slug.value-object");
const service_duration_value_object_1 = require("../../src/domain/service/value-objects/service-duration.value-object");
const service_category_entity_1 = require("../../src/domain/service-category/entities/service-category.entity");
const service_entity_1 = require("../../src/domain/service/entities/service.entity");
describe('Phase 1 domain invariants', () => {
    it('accepts valid locale values and rejects invalid ones', () => {
        expect(() => locale_value_object_1.Locale.create('en-US')).not.toThrow();
        expect(() => locale_value_object_1.Locale.create('invalid')).toThrow();
    });
    it('accepts valid slugs and rejects invalid ones', () => {
        expect(() => slug_value_object_1.Slug.create('sample-business')).not.toThrow();
        expect(() => slug_value_object_1.Slug.create('Sample Business')).toThrow();
    });
    it('accepts valid service duration and rejects non-positive values', () => {
        expect(() => service_duration_value_object_1.ServiceDuration.create(45)).not.toThrow();
        expect(() => service_duration_value_object_1.ServiceDuration.create(0)).toThrow();
    });
    it('initializes business with draft status and a required profile', () => {
        const business = business_entity_1.Business.create({
            slug: 'demo-business',
            defaultLocale: 'en-US',
            supportedLocales: ['en-US', 'fr-FR'],
            timezone: 'UTC',
            currency: 'USD',
            profile: {
                name: 'Demo Business',
                description: 'Example',
                contactEmail: 'hello@example.com',
            },
        }, 'org-123');
        expect(business.status.valueOf()).toBe(business_status_value_object_1.BusinessStatus.draft().valueOf());
        expect(business.profile.name).toBe('Demo Business');
    });
    it('rejects self-parent categories', () => {
        const category = service_category_entity_1.ServiceCategory.create({
            businessId: 'business-1',
            name: 'Root',
            slug: 'root',
        });
        expect(() => category.setParent(category.id)).toThrow();
    });
    it('rejects invalid service duration values', () => {
        expect(() => service_entity_1.Service.create({
            businessId: 'business-1',
            categoryId: 'category-1',
            name: 'Massage',
            slug: 'massage',
            durationMinutes: 60,
            active: true,
        })).not.toThrow();
        expect(() => service_entity_1.Service.create({
            businessId: 'business-1',
            categoryId: 'category-1',
            name: 'Bad Service',
            slug: 'bad-service',
            durationMinutes: 0,
            active: true,
        })).toThrow();
    });
});
