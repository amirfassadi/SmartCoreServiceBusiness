import { jest } from '@jest/globals';
import { AddBusinessLocationUseCase } from '../../src/application/business-location/add-business-location.use-case';
import { DeactivateBusinessLocationUseCase } from '../../src/application/business-location/deactivate-business-location.use-case';
import { GetBusinessLocationsUseCase } from '../../src/application/business-location/get-business-locations.use-case';
import { UpdateBusinessLocationUseCase } from '../../src/application/business-location/update-business-location.use-case';
import { BusinessLocation } from '../../src/domain/business-location/entities/business-location.entity';
import { BusinessLocationRepositoryPort, CreateBusinessLocationInput } from '../../src/domain/business-location/business-location.repository.port';
import { BusinessRepositoryPort } from '../../src/domain/business/business.repository.port';
import { BusinessContext } from '../../src/shared/context/request-context';

const context: BusinessContext = { organizationId: 'org-1', actorId: 'actor-1', businessId: 'business-1' };

function location(overrides: Partial<{ id: string; businessId: string; name: string; timezone: string; active: boolean }> = {}): BusinessLocation {
  return new BusinessLocation({
    id: overrides.id ?? 'location-1',
    businessId: overrides.businessId ?? context.businessId,
    name: overrides.name ?? 'Main',
    timezone: overrides.timezone ?? 'UTC',
    active: overrides.active ?? true,
  });
}

function businessRepository(exists = true): BusinessRepositoryPort {
  return { getById: jest.fn(() => Promise.resolve(exists ? {} : null)) } as unknown as BusinessRepositoryPort;
}

function locationRepository(existing = location()): BusinessLocationRepositoryPort {
  return {
    create: jest.fn((input: CreateBusinessLocationInput) => Promise.resolve(new BusinessLocation(input))),
    getById: jest.fn(() => Promise.resolve(existing)),
    listByBusiness: jest.fn(() => Promise.resolve([existing])),
    update: jest.fn((_id: string, input: Partial<CreateBusinessLocationInput>) => Promise.resolve(new BusinessLocation({
      id: existing.id,
      businessId: existing.businessId,
      name: input.name ?? existing.name,
      address: input.address ?? existing.address,
      timezone: input.timezone ?? existing.timezone,
      active: existing.active,
    }))),
    deactivate: jest.fn(() => Promise.resolve(new BusinessLocation({ ...existing, active: false }))),
  } as unknown as BusinessLocationRepositoryPort;
}

describe('BusinessLocation lifecycle', () => {
  it('creates and lists a location within the business scope', async () => {
    const repository = locationRepository();
    const created = await new AddBusinessLocationUseCase(businessRepository(), repository).execute({ businessId: context.businessId, name: '  Branch  ', timezone: 'Europe/London' }, context);
    const listed = await new GetBusinessLocationsUseCase(businessRepository(), repository).execute(context.businessId, context);

    expect(created.name).toBe('Branch');
    expect(created.timezone).toBe('Europe/London');
    expect(listed).toHaveLength(1);
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Branch' }), context);
    expect(repository.listByBusiness).toHaveBeenCalledWith(context);
  });

  it('updates a location and deactivates it without deleting it', async () => {
    const repository = locationRepository();
    const updated = await new UpdateBusinessLocationUseCase(businessRepository(), repository).execute('location-1', { name: 'Updated', timezone: 'Asia/Tehran' }, context);
    const deactivated = await new DeactivateBusinessLocationUseCase(businessRepository(), repository).execute('location-1', context);

    expect(updated.name).toBe('Updated');
    expect(updated.timezone).toBe('Asia/Tehran');
    expect(deactivated.id).toBe('location-1');
    expect(deactivated.active).toBe(false);
    expect(repository.deactivate).toHaveBeenCalledWith('location-1', context);
  });

  it('rejects another business in create, list, and location lookup', async () => {
    const repository = locationRepository(location({ businessId: 'business-2' }));
    const otherContext = { ...context, businessId: 'business-2' };

    await expect(new AddBusinessLocationUseCase(businessRepository(), repository).execute({ businessId: 'business-2', name: 'Other', timezone: 'UTC' }, context)).rejects.toMatchObject({ code: 'BUSINESS_ACCESS_DENIED' });
    await expect(new GetBusinessLocationsUseCase(businessRepository(), repository).execute('business-2', context)).rejects.toMatchObject({ code: 'BUSINESS_ACCESS_DENIED' });
    await expect(new UpdateBusinessLocationUseCase(businessRepository(), repository).execute('location-1', { name: 'Changed' }, context)).rejects.toMatchObject({ code: 'BUSINESS_ACCESS_DENIED' });
    await expect(new DeactivateBusinessLocationUseCase(businessRepository(), repository).execute('location-1', context)).rejects.toMatchObject({ code: 'BUSINESS_ACCESS_DENIED' });
    expect(otherContext.businessId).toBe('business-2');
  });

  it('rejects invalid timezone and empty names', async () => {
    expect(() => BusinessLocation.create({ businessId: context.businessId, name: 'Main', timezone: 'not a timezone' })).toThrow('Invalid timezone.');
    expect(() => BusinessLocation.create({ businessId: context.businessId, name: '   ', timezone: 'UTC' })).toThrow('Location name is required.');
    const entity = location();
    expect(() => entity.update({ name: '   ' })).toThrow('Location name is required.');
  });

  it('returns not found when the business does not exist', async () => {
    const repository = locationRepository();
    await expect(new GetBusinessLocationsUseCase(businessRepository(false), repository).execute(context.businessId, context)).rejects.toMatchObject({ code: 'BUSINESS_NOT_FOUND' });
    await expect(new AddBusinessLocationUseCase(businessRepository(false), repository).execute({ businessId: context.businessId, name: 'Main', timezone: 'UTC' }, context)).rejects.toMatchObject({ code: 'BUSINESS_NOT_FOUND' });
  });
});