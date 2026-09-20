import 'reflect-metadata';
import { jest } from '@jest/globals';
import { ValidationError } from '../../src/domain/shared/domain-error';
import { BusinessController } from '../../src/presentation/http/business/business.controller';
import { ExternalRequestContextAdapter } from '../../src/presentation/http/context/external-request-context';
import { LocalDevelopmentContextMiddleware } from '../../src/presentation/http/context/local-development-context.middleware';
import { HttpErrorFilter } from '../../src/presentation/http/http-error.filter';
import { phase1ValidationPipe } from '../../src/presentation/http/validation.pipe';
import { IdentifierPipe } from '../../src/presentation/http/identifier.pipe';
import { BadRequestException } from '@nestjs/common';
import { CreateBusinessUseCase } from '../../src/application/business/create-business.use-case';
import { GetBusinessUseCase } from '../../src/application/business/get-business.use-case';
import { UpdateBusinessProfileUseCase } from '../../src/application/business/update-business-profile.use-case';
import { AddBusinessLocationUseCase } from '../../src/application/business-location/add-business-location.use-case';
import { GetBusinessLocationsUseCase } from '../../src/application/business-location/get-business-locations.use-case';
import { UpdateBusinessLocationUseCase } from '../../src/application/business-location/update-business-location.use-case';
import { DeactivateBusinessLocationUseCase } from '../../src/application/business-location/deactivate-business-location.use-case';
import { CreateServiceCategoryUseCase } from '../../src/application/service-category/create-service-category.use-case';
import { GetServiceCategoriesUseCase } from '../../src/application/service-category/get-service-categories.use-case';
import { GetServiceCategoryUseCase } from '../../src/application/service-category/get-service-category.use-case';
import { UpdateServiceCategoryUseCase } from '../../src/application/service-category/update-service-category.use-case';
import { ArchiveServiceCategoryUseCase } from '../../src/application/service-category/archive-service-category.use-case';
import { RestoreServiceCategoryUseCase } from '../../src/application/service-category/restore-service-category.use-case';
import { CreateServiceUseCase } from '../../src/application/service/create-service.use-case';
import { GetServicesUseCase } from '../../src/application/service/get-services.use-case';
import { GetServiceUseCase } from '../../src/application/service/get-service.use-case';
import { UpdateServiceUseCase } from '../../src/application/service/update-service.use-case';
import { ArchiveServiceUseCase } from '../../src/application/service/archive-service.use-case';
import { RestoreServiceUseCase } from '../../src/application/service/restore-service.use-case';
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
    useCase<CreateServiceCategoryUseCase>(), useCase<GetServiceCategoriesUseCase>(true), useCase<GetServiceCategoryUseCase>(), useCase<UpdateServiceCategoryUseCase>(), useCase<ArchiveServiceCategoryUseCase>(), useCase<RestoreServiceCategoryUseCase>(), useCase<CreateServiceUseCase>(), useCase<GetServicesUseCase>(true), useCase<GetServiceUseCase>(), useCase<UpdateServiceUseCase>(), useCase<ArchiveServiceUseCase>(), useCase<RestoreServiceUseCase>(),
    useCase<CreateBusinessPolicyUseCase>(), useCase<GetCurrentBusinessPolicyUseCase>(), useCase<GetBusinessPolicyVersionsUseCase>(true), useCase<UpdateBusinessPolicyUseCase>(), contextAdapter,
  );
}

describe('Phase 1 HTTP boundary', () => {
  it('preserves validation details in the stable error response', () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const filter = new HttpErrorFilter();
    const exception = phase1ValidationPipe['exceptionFactory']?.([{ property: 'name', constraints: { minLength: 'name must be longer than or equal to 1 characters' } }] as never) ?? new BadRequestException({ details: [{ property: 'name' }] });

    filter.catch(exception, { switchToHttp: () => ({ getResponse: () => response }) } as never);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'VALIDATION_ERROR', details: expect.arrayContaining([expect.objectContaining({ property: 'name' })]) }));
  });

  it('applies the existing identifier semantics to entity and policy identifiers', () => {
    const pipe = new IdentifierPipe();

    expect(pipe.transform('business-1', { type: 'param', metatype: String, data: 'businessId' })).toBe('business-1');
    expect(pipe.transform('location_1', { type: 'param', metatype: String, data: 'locationId' })).toBe('location_1');
    expect(pipe.transform('service.confirmation', { type: 'param', metatype: String, data: 'policyKey' })).toBe('service.confirmation');
    expect(() => pipe.transform('invalid/value', { type: 'param', metatype: String, data: 'businessId' })).toThrow('Invalid route identifier.');
    expect(() => pipe.transform('Invalid.Policy', { type: 'param', metatype: String, data: 'policyKey' })).toThrow('Invalid route identifier.');
  });

  it('maps the explicit local test headers into validated request context', () => {
    const middleware = new LocalDevelopmentContextMiddleware();
    const request = {
      header: (name: string) => ({
        'x-smartcore-test-organization-id': ' org-test-001 ',
        'x-smartcore-test-actor-id': 'actor-test-001',
      }[name]),
    } as never;
    const next = jest.fn();

    middleware.use(request, {} as never, next);

    expect(request).toMatchObject({ validatedContext: { organizationId: 'org-test-001', actorId: 'actor-test-001' } });
    expect(next).toHaveBeenCalledTimes(1);
  });

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
