"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const add_business_location_use_case_1 = require("../../src/application/business-location/add-business-location.use-case");
const create_business_policy_use_case_1 = require("../../src/application/business-policy/create-business-policy.use-case");
const update_business_policy_use_case_1 = require("../../src/application/business-policy/update-business-policy.use-case");
const create_service_category_use_case_1 = require("../../src/application/service-category/create-service-category.use-case");
const create_service_use_case_1 = require("../../src/application/service/create-service.use-case");
const business_entity_1 = require("../../src/domain/business/entities/business.entity");
const domain_error_1 = require("../../src/domain/shared/domain-error");
const context = { organizationId: 'org-1', businessId: 'business-1', actorId: 'actor-1' };
function businessRepository(existing = true) {
    const business = existing
        ? business_entity_1.Business.create({ slug: 'business', defaultLocale: 'en-US', supportedLocales: ['en-US'], timezone: 'UTC', currency: 'USD', profile: { name: 'Business' } }, context.organizationId)
        : null;
    return {
        create: globals_1.jest.fn(),
        getById: globals_1.jest.fn(() => Promise.resolve(business)),
        getBySlug: globals_1.jest.fn(() => Promise.resolve(null)),
        listByOrganization: globals_1.jest.fn(),
        updateProfile: globals_1.jest.fn(),
    };
}
describe('Phase 1 application ownership and versioning', () => {
    it('rejects a location for a different business selector', async () => {
        const locations = { create: globals_1.jest.fn(), getById: globals_1.jest.fn(), listByBusiness: globals_1.jest.fn(), update: globals_1.jest.fn(), deactivate: globals_1.jest.fn() };
        const useCase = new add_business_location_use_case_1.AddBusinessLocationUseCase(businessRepository(), locations);
        await expect(useCase.execute({ businessId: 'business-2', name: 'Other', timezone: 'UTC' }, context)).rejects.toMatchObject({ code: 'BUSINESS_ACCESS_DENIED' });
        expect(locations.create).not.toHaveBeenCalled();
    });
    it('rejects a missing business before creating a category', async () => {
        const categories = { create: globals_1.jest.fn(), getById: globals_1.jest.fn(), listByBusiness: globals_1.jest.fn(), getBySlug: globals_1.jest.fn(), validateParentOwnership: globals_1.jest.fn() };
        const useCase = new create_service_category_use_case_1.CreateServiceCategoryUseCase(businessRepository(false), categories);
        await expect(useCase.execute({ businessId: context.businessId, name: 'Root', slug: 'root' }, context)).rejects.toMatchObject({ code: 'BUSINESS_NOT_FOUND' });
        expect(categories.create).not.toHaveBeenCalled();
    });
    it('rejects a cross-business category reference before creating a service', async () => {
        const services = {
            create: globals_1.jest.fn(), getById: globals_1.jest.fn(), listByBusiness: globals_1.jest.fn(), update: globals_1.jest.fn(), archive: globals_1.jest.fn(),
            validateCategoryOwnership: globals_1.jest.fn(() => Promise.resolve(false)), getBySlug: globals_1.jest.fn(),
        };
        const useCase = new create_service_use_case_1.CreateServiceUseCase(businessRepository(), services);
        await expect(useCase.execute({ businessId: context.businessId, categoryId: 'category-other', name: 'Service', slug: 'service', durationMinutes: 30 }, context)).rejects.toMatchObject({ code: 'INVALID_SERVICE_CATEGORY' });
        expect(services.create).not.toHaveBeenCalled();
    });
    it('rejects a cross-business policy creation and preserves version conflict errors', async () => {
        const policies = {
            createVersion: globals_1.jest.fn(), getCurrentByKey: globals_1.jest.fn(), getVersions: globals_1.jest.fn(), appendVersion: globals_1.jest.fn(),
        };
        const create = new create_business_policy_use_case_1.CreateBusinessPolicyUseCase(businessRepository(), policies);
        await expect(create.execute({ businessId: 'business-2', policyKey: 'service.confirmation', policyValueJson: { required: true } }, context)).rejects.toMatchObject({ code: 'BUSINESS_ACCESS_DENIED' });
        const current = { id: 'policy-1', businessId: context.businessId, policyKey: 'service.confirmation', policyValueJson: { required: true }, version: 1, createdAt: new Date(), updatedAt: new Date() };
        policies.getCurrentByKey = globals_1.jest.fn(() => Promise.resolve(current));
        policies.appendVersion = globals_1.jest.fn(() => Promise.reject(new domain_error_1.DomainError('POLICY_VERSION_CONFLICT', 'Policy version conflict.')));
        const update = new update_business_policy_use_case_1.UpdateBusinessPolicyUseCase(businessRepository(), policies);
        await expect(update.execute('service.confirmation', { required: false }, context)).rejects.toMatchObject({ code: 'POLICY_VERSION_CONFLICT' });
        expect(policies.appendVersion).toHaveBeenCalledWith({ businessId: context.businessId, policyKey: 'service.confirmation', policyValueJson: { required: false } }, 1, context);
    });
});
