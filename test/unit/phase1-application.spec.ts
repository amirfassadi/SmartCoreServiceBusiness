import { jest } from '@jest/globals';
import { AddBusinessLocationUseCase } from '../../src/application/business-location/add-business-location.use-case';
import { CreateBusinessPolicyUseCase } from '../../src/application/business-policy/create-business-policy.use-case';
import { UpdateBusinessPolicyUseCase } from '../../src/application/business-policy/update-business-policy.use-case';
import { CreateServiceCategoryUseCase } from '../../src/application/service-category/create-service-category.use-case';
import { CreateServiceUseCase } from '../../src/application/service/create-service.use-case';
import { BusinessRepositoryPort } from '../../src/domain/business/business.repository.port';
import { Business } from '../../src/domain/business/entities/business.entity';
import { BusinessLocationRepositoryPort } from '../../src/domain/business-location/business-location.repository.port';
import { BusinessPolicyRepositoryPort } from '../../src/domain/business-policy/business-policy.repository.port';
import { ServiceCategoryRepositoryPort } from '../../src/domain/service-category/service-category.repository.port';
import { ServiceRepositoryPort } from '../../src/domain/service/service.repository.port';
import { BusinessContext } from '../../src/shared/context/request-context';
import { DomainError } from '../../src/domain/shared/domain-error';

const context: BusinessContext = { organizationId: 'org-1', businessId: 'business-1', actorId: 'actor-1' };

function businessRepository(existing = true): BusinessRepositoryPort {
  const business = existing
    ? Business.create({ slug: 'business', defaultLocale: 'en-US', supportedLocales: ['en-US'], timezone: 'UTC', currency: 'USD', profile: { name: 'Business' } }, context.organizationId)
    : null;
  return {
    create: jest.fn(),
    getById: jest.fn(() => Promise.resolve(business)),
    getBySlug: jest.fn(() => Promise.resolve(null)),
    listByOrganization: jest.fn(),
    updateProfile: jest.fn(),
  } as unknown as BusinessRepositoryPort;
}

describe('Phase 1 application ownership and versioning', () => {
  it('rejects a location for a different business selector', async () => {
    const locations = { create: jest.fn(), getById: jest.fn(), listByBusiness: jest.fn(), update: jest.fn(), deactivate: jest.fn() } as unknown as BusinessLocationRepositoryPort;
    const useCase = new AddBusinessLocationUseCase(businessRepository(), locations);

    await expect(useCase.execute({ businessId: 'business-2', name: 'Other', timezone: 'UTC' }, context)).rejects.toMatchObject({ code: 'BUSINESS_ACCESS_DENIED' });
    expect(locations.create).not.toHaveBeenCalled();
  });

  it('rejects a missing business before creating a category', async () => {
    const categories = { create: jest.fn(), getById: jest.fn(), listByBusiness: jest.fn(), getBySlug: jest.fn(), validateParentOwnership: jest.fn() } as unknown as ServiceCategoryRepositoryPort;
    const useCase = new CreateServiceCategoryUseCase(businessRepository(false), categories);

    await expect(useCase.execute({ businessId: context.businessId, name: 'Root', slug: 'root' }, context)).rejects.toMatchObject({ code: 'BUSINESS_NOT_FOUND' });
    expect(categories.create).not.toHaveBeenCalled();
  });

  it('rejects a cross-business category reference before creating a service', async () => {
    const services = {
      create: jest.fn(), getById: jest.fn(), listByBusiness: jest.fn(), update: jest.fn(), archive: jest.fn(),
      validateCategoryOwnership: jest.fn(() => Promise.resolve(false)), getBySlug: jest.fn(),
    } as unknown as ServiceRepositoryPort;
    const useCase = new CreateServiceUseCase(businessRepository(), services);

    await expect(useCase.execute({ businessId: context.businessId, categoryId: 'category-other', name: 'Service', slug: 'service', durationMinutes: 30 }, context)).rejects.toMatchObject({ code: 'INVALID_SERVICE_CATEGORY' });
    expect(services.create).not.toHaveBeenCalled();
  });

  it('rejects a cross-business policy creation and preserves version conflict errors', async () => {
    const policies = {
      createVersion: jest.fn(), getCurrentByKey: jest.fn(), getVersions: jest.fn(), appendVersion: jest.fn(),
    } as unknown as BusinessPolicyRepositoryPort;
    const create = new CreateBusinessPolicyUseCase(businessRepository(), policies);
    await expect(create.execute({ businessId: 'business-2', policyKey: 'service.confirmation', policyValueJson: { required: true } }, context)).rejects.toMatchObject({ code: 'BUSINESS_ACCESS_DENIED' });

    const current = { id: 'policy-1', businessId: context.businessId, policyKey: 'service.confirmation', policyValueJson: { required: true }, version: 1, createdAt: new Date(), updatedAt: new Date() };
    policies.getCurrentByKey = jest.fn(() => Promise.resolve(current)) as unknown as BusinessPolicyRepositoryPort['getCurrentByKey'];
    policies.appendVersion = jest.fn(() => Promise.reject(new DomainError('POLICY_VERSION_CONFLICT', 'Policy version conflict.'))) as unknown as BusinessPolicyRepositoryPort['appendVersion'];
    const update = new UpdateBusinessPolicyUseCase(businessRepository(), policies);

    await expect(update.execute('service.confirmation', { required: false }, context)).rejects.toMatchObject({ code: 'POLICY_VERSION_CONFLICT' });
    expect(policies.appendVersion).toHaveBeenCalledWith({ businessId: context.businessId, policyKey: 'service.confirmation', policyValueJson: { required: false } }, 1, context);
  });
});
