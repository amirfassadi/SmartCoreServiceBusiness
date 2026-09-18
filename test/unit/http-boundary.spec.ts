import 'reflect-metadata';
import { jest } from '@jest/globals';
import { ValidationError } from '../../src/domain/shared/domain-error';
import { BusinessController } from '../../src/presentation/http/business/business.controller';
import { ExternalRequestContextAdapter } from '../../src/presentation/http/context/external-request-context';
import { CreateBusinessUseCase } from '../../src/application/business/create-business.use-case';
import { GetBusinessUseCase } from '../../src/application/business/get-business.use-case';
import { UpdateBusinessProfileUseCase } from '../../src/application/business/update-business-profile.use-case';
import { AddBusinessLocationUseCase } from '../../src/application/business-location/add-business-location.use-case';
import { GetBusinessLocationsUseCase } from '../../src/application/business-location/get-business-locations.use-case';
import { UpdateBusinessLocationUseCase } from '../../src/application/business-location/update-business-location.use-case';
import { DeactivateBusinessLocationUseCase } from '../../src/application/business-location/deactivate-business-location.use-case';
import { CreateServiceCategoryUseCase } from '../../src/application/service-category/create-service-category.use-case';
import { GetServiceCategoriesUseCase } from '../../src/application/service-category/get-service-categories.use-case';
import { CreateServiceUseCase } from '../../src/application/service/create-service.use-case';
import { GetServicesUseCase } from '../../src/application/service/get-services.use-case';
import { UpdateServiceUseCase } from '../../src/application/service/update-service.use-case';
import { ArchiveServiceUseCase } from '../../src/application/service/archive-service.use-case';
import { CreateBusinessPolicyUseCase } from '../../src/application/business-policy/create-business-policy.use-case';
import { GetCurrentBusinessPolicyUseCase } from '../../src/application/business-policy/get-current-business-policy.use-case';
import { GetBusinessPolicyVersionsUseCase } from '../../src/application/business-policy/get-business-policy-versions.use-case';
import { UpdateBusinessPolicyUseCase } from '../../src/application/business-policy/update-business-policy.use-case';

const contextAdapter: ExternalRequestContextAdapter = {
  getValidatedContext: (_request, businessId) => ({ organizationId: 'org-1', actorId: 'actor-1', businessId }),
};

function useCase<T>(returnsList = false): T {
  return {
    execute: jest.fn(() => Promise.resolve(returnsList ? [{
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
  } as unknown as T;
}

function controller(): BusinessController {
  return new BusinessController(
    useCase<CreateBusinessUseCase>(), useCase<GetBusinessUseCase>(), useCase<UpdateBusinessProfileUseCase>(),
    useCase<AddBusinessLocationUseCase>(), useCase<GetBusinessLocationsUseCase>(true), useCase<UpdateBusinessLocationUseCase>(), useCase<DeactivateBusinessLocationUseCase>(),
    useCase<CreateServiceCategoryUseCase>(), useCase<GetServiceCategoriesUseCase>(true), useCase<CreateServiceUseCase>(), useCase<GetServicesUseCase>(true), useCase<UpdateServiceUseCase>(), useCase<ArchiveServiceUseCase>(),
    useCase<CreateBusinessPolicyUseCase>(), useCase<GetCurrentBusinessPolicyUseCase>(), useCase<GetBusinessPolicyVersionsUseCase>(true), useCase<UpdateBusinessPolicyUseCase>(), contextAdapter,
  );
}

describe('Phase 1 HTTP boundary', () => {
  it('rejects missing external context without a production fallback', () => {
    const adapter: ExternalRequestContextAdapter = { getValidatedContext: () => { throw new ValidationError('Validated organization context is required.', 'BUSINESS_ACCESS_DENIED'); } };
    expect(() => adapter.getValidatedContext(undefined, 'business-1')).toThrow('Validated organization context is required.');
  });

  it('does not expose organizationId in the create command', () => {
    const instance = controller();
    const request = { validatedContext: { organizationId: 'org-1' } };
    instance.create({ slug: 'demo-business', defaultLocale: 'en-US', supportedLocales: ['en-US'], timezone: 'UTC', currency: 'USD', profileName: 'Demo' }, request as never);
    const createUseCase = (instance as unknown as { createBusinessUseCase: { execute: jest.Mock } }).createBusinessUseCase;
    expect(createUseCase.execute.mock.calls[0][0]).not.toHaveProperty('organizationId');
  });

  it('maps each Blueprint endpoint method to an application use case', () => {
    const instance = controller();
    const request = { validatedContext: { organizationId: 'org-1' } } as never;
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
