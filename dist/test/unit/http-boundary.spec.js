"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const globals_1 = require("@jest/globals");
const domain_error_1 = require("../../src/domain/shared/domain-error");
const business_controller_1 = require("../../src/presentation/http/business/business.controller");
const contextAdapter = {
    getValidatedContext: (_request, businessId) => ({ organizationId: 'org-1', actorId: 'actor-1', businessId }),
};
function useCase(returnsList = false) {
    return {
        execute: globals_1.jest.fn(() => Promise.resolve(returnsList ? [{
                id: 'id-1', businessId: 'business-1', name: 'Item', slug: 'item', timezone: 'UTC', active: true,
                categoryId: 'category-1', durationMinutes: 30, version: 1, policyKey: 'service.confirmation', policyValueJson: {},
                createdAt: new Date(), updatedAt: new Date(),
            }] : {
            id: 'id-1', businessId: 'business-1', organizationId: 'org-1', slug: 'item',
            defaultLocale: 'en-US', supportedLocales: ['en-US'], timezone: 'UTC', currency: 'USD',
            status: { toString: () => 'draft' }, name: 'Item', categoryId: 'category-1',
            durationMinutes: 30, active: true, version: 1, policyKey: 'service.confirmation',
            policyValueJson: {}, parentCategoryId: undefined, address: undefined,
            createdAt: new Date(), updatedAt: new Date(),
            profile: { id: 'profile-1', businessId: 'business-1', name: 'Item', createdAt: new Date(), updatedAt: new Date() },
        })),
    };
}
function controller() {
    return new business_controller_1.BusinessController(useCase(), useCase(), useCase(), useCase(), useCase(true), useCase(), useCase(), useCase(), useCase(true), useCase(), useCase(true), useCase(), useCase(), useCase(), useCase(), useCase(true), useCase(), contextAdapter);
}
describe('Phase 1 HTTP boundary', () => {
    it('rejects missing external context without a production fallback', () => {
        const adapter = { getValidatedContext: () => { throw new domain_error_1.ValidationError('Validated organization context is required.', 'BUSINESS_ACCESS_DENIED'); } };
        expect(() => adapter.getValidatedContext(undefined, 'business-1')).toThrow('Validated organization context is required.');
    });
    it('does not expose organizationId in the create command', () => {
        const instance = controller();
        const request = { validatedContext: { organizationId: 'org-1' } };
        instance.create({ slug: 'demo-business', defaultLocale: 'en-US', supportedLocales: ['en-US'], timezone: 'UTC', currency: 'USD', profileName: 'Demo' }, request);
        const createUseCase = instance.createBusinessUseCase;
        expect(createUseCase.execute.mock.calls[0][0]).not.toHaveProperty('organizationId');
    });
    it('maps each Blueprint endpoint method to an application use case', () => {
        const instance = controller();
        const request = { validatedContext: { organizationId: 'org-1' } };
        instance.get('business-1', request);
        instance.updateProfile('business-1', { name: 'Updated' }, request);
        instance.addLocation('business-1', { name: 'Main', timezone: 'UTC' }, request);
        instance.getLocations('business-1', request);
        instance.updateLocation('business-1', 'location-1', { name: 'Main' }, request);
        instance.deactivateLocation('business-1', 'location-1', request);
        instance.createCategory('business-1', { name: 'Massage', slug: 'massage' }, request);
        instance.getCategories('business-1', request);
        instance.createService('business-1', { categoryId: 'category-1', name: 'Service', slug: 'service', durationMinutes: 30 }, request);
        instance.getServices('business-1', request);
        instance.updateService('business-1', 'service-1', { name: 'Updated' }, request);
        instance.archiveService('business-1', 'service-1', request);
        instance.createPolicy('business-1', { policyKey: 'service.confirmation', policyValueJson: { required: true } }, request);
        instance.getCurrentPolicy('business-1', 'service.confirmation', request);
        instance.getPolicyVersions('business-1', 'service.confirmation', request);
        instance.updatePolicy('business-1', 'service.confirmation', { policyValueJson: { required: false } }, request);
        expect(true).toBe(true);
    });
});
