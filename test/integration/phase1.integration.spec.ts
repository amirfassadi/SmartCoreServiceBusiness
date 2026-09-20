import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createIntegrationApp } from './helpers/app';
import { cleanFixtures, createTestPrisma, fixturePrefix } from './helpers/database';
import { BusinessPolicyPrismaRepository } from '../../src/infrastructure/persistence/prisma/repositories/business-policy-prisma.repository';

type BusinessResponse = {
  id: string;
  organizationId: string;
  slug: string;
  defaultLocale: string;
  supportedLocales: string[];
  timezone: string;
  currency: string;
  status: string;
  profile: { id: string; businessId: string; name: string };
};

type LocationResponse = { id: string; businessId: string; name: string; active: boolean };
type CategoryResponse = { id: string; businessId: string; slug: string; status: string; archivedAt?: string | null };
type ServiceResponse = { id: string; businessId: string; slug: string; status: string; archivedAt?: string | null };
type PolicyResponse = { id: string; businessId: string; policyKey: string; version: number };

const organizationA = 'integration-org-a';
const organizationB = 'integration-org-b';

function headers(organizationId: string) {
  return {
    'x-smartcore-test-organization-id': organizationId,
    'x-smartcore-test-actor-id': 'integration-actor',
  };
}

function businessBody(slug: string, profileName = 'Integration Business') {
  return {
    slug,
    defaultLocale: 'en-US',
    supportedLocales: ['en-US'],
    timezone: 'UTC',
    currency: 'USD',
    profileName,
  };
}

async function createBusiness(app: INestApplication, organizationId: string, suffix: string): Promise<BusinessResponse> {
  const response = await request(app.getHttpServer())
    .post('/api/v1/businesses')
    .set(headers(organizationId))
    .send(businessBody(`${fixturePrefix}${suffix}`))
    .expect(201);
  return response.body as BusinessResponse;
}

describe('Phase 1 HTTP and PostgreSQL integration', () => {
  let app!: INestApplication;
  let prisma!: PrismaClient;

  beforeAll(async () => {
    prisma = createTestPrisma();
    await prisma.$connect();
    await cleanFixtures(prisma);
    app = await createIntegrationApp();
  });

  afterAll(async () => {
    if (app) await app.close();
    if (prisma) {
      await cleanFixtures(prisma);
      await prisma.$disconnect();
    }
  });

  it('creates and gets a business with its persisted profile', async () => {
    const created = await createBusiness(app, organizationA, 'business-a');
    expect(created).toMatchObject({
      organizationId: organizationA,
      slug: `${fixturePrefix}business-a`,
      defaultLocale: 'en-US',
      supportedLocales: ['en-US'],
      timezone: 'UTC',
      currency: 'USD',
      status: 'draft',
      profile: { businessId: created.id, name: 'Integration Business' },
    });

    const stored = await prisma.business.findUnique({ where: { id: created.id }, include: { profile: true } });
    expect(stored?.organizationId).toBe(organizationA);
    expect(stored?.profile?.name).toBe('Integration Business');

    const fetched = await request(app.getHttpServer()).get(`/api/v1/businesses/${created.id}`).set(headers(organizationA)).expect(200);
    expect(fetched.body).toMatchObject({ id: created.id, profile: { id: stored?.profile?.id, name: 'Integration Business' } });
  });

  it('rejects missing context and preserves DTO validation details', async () => {
    const missingContext = await request(app.getHttpServer()).post('/api/v1/businesses').send(businessBody(`${fixturePrefix}missing-context`)).expect(403);
    expect(missingContext.body).toMatchObject({ code: 'BUSINESS_ACCESS_DENIED' });

    const invalid = await request(app.getHttpServer()).post('/api/v1/businesses').set(headers(organizationA)).send({ ...businessBody(`${fixturePrefix}invalid`), profileName: '' }).expect(400);
    expect(invalid.body).toMatchObject({ code: 'VALIDATION_ERROR' });
    expect(invalid.body.details).toEqual(expect.arrayContaining([expect.objectContaining({ property: 'profileName' })]));
  });

  it('handles missing profiles explicitly and isolates businesses by organization', async () => {
    const businessA = await createBusiness(app, organizationA, 'isolation-a');
    const businessB = await createBusiness(app, organizationB, 'isolation-b');
    await prisma.businessProfile.delete({ where: { businessId: businessA.id } });

    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}`).set(headers(organizationA)).expect(404).expect((response) => {
      expect(response.body).toMatchObject({ code: 'PROFILE_NOT_FOUND' });
    });
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessB.id}`).set(headers(organizationA)).expect(404).expect((response) => {
      expect(response.body).toMatchObject({ code: 'BUSINESS_NOT_FOUND' });
    });
  });

  it('allows same-organization business selection but rejects cross-organization business and profile access', async () => {
    const businessA = await createBusiness(app, organizationA, 'business-scope-a');
    const businessB = await createBusiness(app, organizationA, 'business-scope-b');

    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessB.id}`).set(headers(organizationA)).expect(200);
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}`).set(headers(organizationB)).expect(404).expect((response) => {
      expect(response.body).toMatchObject({ code: 'BUSINESS_NOT_FOUND' });
    });
    await request(app.getHttpServer()).patch(`/api/v1/businesses/${businessB.id}/profile`).set(headers(organizationB)).send({ name: 'Wrong Organization' }).expect(404).expect((response) => {
      expect(response.body).toMatchObject({ code: 'BUSINESS_NOT_FOUND' });
    });
    await request(app.getHttpServer()).patch(`/api/v1/businesses/${businessA.id}/profile`).set(headers(organizationB)).send({ name: 'Wrong Organization' }).expect(404).expect((response) => {
      expect(response.body).toMatchObject({ code: 'BUSINESS_NOT_FOUND' });
    });
  });

  it('updates a profile and persists the change', async () => {
    const business = await createBusiness(app, organizationA, 'profile-update');
    await request(app.getHttpServer()).patch(`/api/v1/businesses/${business.id}/profile`).set(headers(organizationA)).send({ name: 'Updated Integration Business' }).expect(200);
    const stored = await prisma.businessProfile.findUnique({ where: { businessId: business.id } });
    expect(stored?.name).toBe('Updated Integration Business');
  });

  it('returns BUSINESS_NOT_FOUND when updating a nonexistent business profile', async () => {
    await request(app.getHttpServer()).patch('/api/v1/businesses/00000000-0000-0000-0000-000000000000/profile').set(headers(organizationA)).send({ name: 'Updated' }).expect(404).expect((response) => {
      expect(response.body).toMatchObject({ code: 'BUSINESS_NOT_FOUND' });
    });
  });

  it('rejects new active operations for an archived Business', async () => {
    const business = await createBusiness(app, organizationA, 'archived-business');
    await prisma.business.update({ where: { id: business.id }, data: { status: 'archived' } });

    const expectArchived = async (path: string, body: Record<string, unknown>): Promise<void> => {
      await request(app.getHttpServer()).post(path).set(headers(organizationA)).send(body).expect(409).expect((response) => {
        expect(response.body).toMatchObject({ code: 'BUSINESS_ARCHIVED' });
      });
    };

    await expectArchived(`/api/v1/businesses/${business.id}/locations`, { name: 'Archived Location', timezone: 'UTC' });
    await expectArchived(`/api/v1/businesses/${business.id}/service-categories`, { name: 'Archived Category', slug: 'archived-category' });
    await expectArchived(`/api/v1/businesses/${business.id}/services`, { categoryId: '00000000-0000-0000-0000-000000000000', name: 'Archived Service', slug: 'archived-service', durationMinutes: 30 });
    await expectArchived(`/api/v1/businesses/${business.id}/policies`, { policyKey: 'service.archived', policyValueJson: { enabled: true } });

    await expect(prisma.businessLocation.count({ where: { businessId: business.id } })).resolves.toBe(0);
    await expect(prisma.serviceCategory.count({ where: { businessId: business.id } })).resolves.toBe(0);
    await expect(prisma.service.count({ where: { businessId: business.id } })).resolves.toBe(0);
    await expect(prisma.businessPolicy.count({ where: { businessId: business.id } })).resolves.toBe(0);
  });

  it('runs the complete location lifecycle and enforces cross-business access', async () => {
    const businessA = await createBusiness(app, organizationA, 'location-a');
    const businessB = await createBusiness(app, organizationA, 'location-b');
    const created = await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/locations`).set(headers(organizationA)).send({ name: 'Main', timezone: 'UTC' }).expect(201);
    const location = created.body as LocationResponse;
    expect(location).toMatchObject({ businessId: businessA.id, name: 'Main', active: true });
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/locations`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: location.id })])));
    await request(app.getHttpServer()).patch(`/api/v1/businesses/${businessA.id}/locations/${location.id}`).set(headers(organizationA)).send({ name: 'Updated Main' }).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/locations/${location.id}/deactivate`).set(headers(organizationA)).expect(404);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/locations/${location.id}/deactivate`).set(headers(organizationA)).expect(201);
    const stored = await prisma.businessLocation.findUnique({ where: { id: location.id } });
    expect(stored).toMatchObject({ businessId: businessA.id, name: 'Updated Main', active: false });
  });

  it('rejects location update and list access across businesses and organizations', async () => {
    const businessA = await createBusiness(app, organizationA, 'location-scope-a');
    const businessB = await createBusiness(app, organizationA, 'location-scope-b');
    const businessC = await createBusiness(app, organizationB, 'location-scope-c');
    const location = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/locations`).set(headers(organizationA)).send({ name: 'Scoped Main', timezone: 'UTC' }).expect(201)).body as LocationResponse;

    for (const organizationId of [organizationB, organizationA]) {
      await request(app.getHttpServer()).get(`/api/v1/businesses/${businessB.id}/locations`).set(headers(organizationId)).expect(organizationId === organizationA ? 200 : 404);
    }
    await request(app.getHttpServer()).patch(`/api/v1/businesses/${businessA.id}/locations/${location.id}`).set(headers(organizationA)).send({ name: 'Wrong Business' }).expect(404).expect((response) => expect(response.body).toMatchObject({ code: 'LOCATION_NOT_FOUND' }));
    await request(app.getHttpServer()).patch(`/api/v1/businesses/${businessC.id}/locations/${location.id}`).set(headers(organizationB)).send({ name: 'Wrong Organization' }).expect(404).expect((response) => expect(response.body).toMatchObject({ code: 'LOCATION_NOT_FOUND' }));
  });

  it('rejects duplicate business and location names with stable conflicts', async () => {
    const business = await createBusiness(app, organizationA, 'unique-business');
    await request(app.getHttpServer()).post('/api/v1/businesses').set(headers(organizationA)).send(businessBody(`${fixturePrefix}unique-business`)).expect(409).expect((response) => {
      expect(response.body).toMatchObject({ code: 'BUSINESS_SLUG_ALREADY_EXISTS' });
    });

    await request(app.getHttpServer()).post(`/api/v1/businesses/${business.id}/locations`).set(headers(organizationA)).send({ name: 'Main', timezone: 'UTC' }).expect(201);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${business.id}/locations`).set(headers(organizationA)).send({ name: 'Main', timezone: 'UTC' }).expect(409).expect((response) => {
      expect(response.body).toMatchObject({ code: 'LOCATION_NAME_ALREADY_EXISTS' });
    });
  });

  it('covers category and service lifecycle, constraints, and isolation', async () => {
    const businessA = await createBusiness(app, organizationA, 'catalog-a');
    const businessB = await createBusiness(app, organizationA, 'catalog-b');
    const category = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories`).set(headers(organizationA)).send({ name: 'Root', slug: 'root' }).expect(201)).body as CategoryResponse;
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/service-categories`).set(headers(organizationA)).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories`).set(headers(organizationA)).send({ name: 'Duplicate', slug: 'root' }).expect(409);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/services`).set(headers(organizationA)).send({ categoryId: category.id, name: 'Wrong', slug: 'wrong', durationMinutes: 30 }).expect(422);

    const service = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/services`).set(headers(organizationA)).send({ categoryId: category.id, name: 'Service', slug: 'service', durationMinutes: 30 }).expect(201)).body as ServiceResponse;
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/services`).set(headers(organizationA)).expect(200);
    await request(app.getHttpServer()).patch(`/api/v1/businesses/${businessA.id}/services/${service.id}`).set(headers(organizationA)).send({ name: 'Updated Service' }).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/services/${service.id}/archive`).set(headers(organizationA)).expect(404);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/services/${service.id}/archive`).set(headers(organizationA)).expect(201);
    const stored = await prisma.service.findUnique({ where: { id: service.id } });
    expect(stored).toMatchObject({ businessId: businessA.id });
    expect(stored?.archivedAt).not.toBeNull();
    expect(stored?.deletedAt).toBeNull();
  });

  it('supports idempotent service and category lifecycle filtering and isolation', async () => {
    const businessA = await createBusiness(app, organizationA, 'lifecycle-a');
    const businessB = await createBusiness(app, organizationA, 'lifecycle-b');
    const categoryA = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories`).set(headers(organizationA)).send({ name: 'Lifecycle', slug: 'lifecycle' }).expect(201)).body as CategoryResponse;
    const categoryB = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/service-categories`).set(headers(organizationA)).send({ name: 'Other', slug: 'other' }).expect(201)).body as CategoryResponse;
    const serviceA = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/services`).set(headers(organizationA)).send({ categoryId: categoryA.id, name: 'Lifecycle Service', slug: 'lifecycle-service', durationMinutes: 30 }).expect(201)).body as ServiceResponse;
    const serviceB = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/services`).set(headers(organizationA)).send({ categoryId: categoryB.id, name: 'Other Service', slug: 'other-service', durationMinutes: 30 }).expect(201)).body as ServiceResponse;

    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/services/${serviceA.id}`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body).toMatchObject({ status: 'active', archivedAt: null }));
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}/archive`).set(headers(organizationA)).expect(409).expect((response) => expect(response.body).toMatchObject({ code: 'CATEGORY_HAS_ACTIVE_SERVICES' }));
    const archivedService = await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/services/${serviceA.id}/archive`).set(headers(organizationA)).expect(201);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/services/${serviceA.id}/archive`).set(headers(organizationA)).expect(201).expect((response) => expect(response.body.archivedAt).toBe(archivedService.body.archivedAt));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/services`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body).toHaveLength(0));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/services?status=archived`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: serviceA.id, status: 'archived' })])));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/services?status=all`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body).toHaveLength(1));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/services?status=invalid`).set(headers(organizationA)).expect(400);
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/services/${serviceA.id}`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body.status).toBe('archived'));
    await request(app.getHttpServer()).patch(`/api/v1/businesses/${businessA.id}/services/${serviceA.id}`).set(headers(organizationA)).send({ name: 'Blocked' }).expect(409).expect((response) => expect(response.body).toMatchObject({ code: 'SERVICE_ARCHIVED' }));
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/services/${serviceA.id}/restore`).set(headers(organizationA)).expect(404);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/services/${serviceA.id}/restore`).set(headers(organizationA)).expect(201);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/services/${serviceA.id}/restore`).set(headers(organizationA)).expect(201);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/services/${serviceA.id}/archive`).set(headers(organizationA)).expect(201);
    await request(app.getHttpServer()).patch(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}`).set(headers(organizationA)).send({ parentCategoryId: categoryA.id }).expect(422).expect((response) => expect(response.body).toMatchObject({ code: 'INVALID_PARENT_CATEGORY' }));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body.parentCategoryId).toBeUndefined());
    const archivedCategory = await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}/archive`).set(headers(organizationA)).expect(201);
    const archivedCategoryAt = archivedCategory.body.archivedAt;
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}/archive`).set(headers(organizationA)).expect(201).expect((response) => expect(response.body.archivedAt).toBe(archivedCategoryAt));
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/services/${serviceA.id}/restore`).set(headers(organizationA)).expect(409).expect((response) => expect(response.body).toMatchObject({ code: 'CATEGORY_ARCHIVED' }));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/services/${serviceA.id}`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body.status).toBe('archived'));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/service-categories`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body).toHaveLength(0));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/service-categories?status=active`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body).toHaveLength(0));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/service-categories?status=archived`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: categoryA.id, status: 'archived' })])));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/service-categories?status=all`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body).toHaveLength(1));
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}/restore`).set(headers(organizationA)).expect(201);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}/restore`).set(headers(organizationA)).expect(201).expect((response) => expect(response.body.archivedAt).toBeNull());
    const finalArchivedCategory = await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}/archive`).set(headers(organizationA)).expect(201);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}/archive`).set(headers(organizationA)).expect(201).expect((response) => expect(response.body.archivedAt).toBe(finalArchivedCategory.body.archivedAt));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body).toMatchObject({ status: 'archived', archivedAt: finalArchivedCategory.body.archivedAt }));
    await request(app.getHttpServer()).patch(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}`).set(headers(organizationA)).send({ name: 'Blocked' }).expect(409).expect((response) => expect(response.body).toMatchObject({ code: 'CATEGORY_ARCHIVED' }));
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/service-categories/${categoryA.id}/restore`).set(headers(organizationA)).expect(404);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories/${categoryA.id}/restore`).set(headers(organizationA)).expect(201);
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessA.id}/services/${serviceB.id}`).set(headers(organizationA)).expect(404);
  });

  it('enforces cross-organization isolation for locations, categories, services, and policies', async () => {
    const businessA = await createBusiness(app, organizationA, 'cross-org-a');
    const businessB = await createBusiness(app, organizationB, 'cross-org-b');
    const location = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/locations`).set(headers(organizationB)).send({ name: 'Other Main', timezone: 'UTC' }).expect(201)).body as LocationResponse;
    const category = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/service-categories`).set(headers(organizationB)).send({ name: 'Other Root', slug: 'other-root' }).expect(201)).body as CategoryResponse;
    const service = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/services`).set(headers(organizationB)).send({ categoryId: category.id, name: 'Other Service', slug: 'other-service', durationMinutes: 30 }).expect(201)).body as ServiceResponse;
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/policies`).set(headers(organizationB)).send({ policyKey: 'service.other', policyValueJson: { enabled: true } }).expect(201);

    for (const path of [
      `/api/v1/businesses/${businessB.id}/locations`,
      `/api/v1/businesses/${businessB.id}/service-categories`,
      `/api/v1/businesses/${businessB.id}/services`,
      `/api/v1/businesses/${businessB.id}/policies/service.other`,
    ]) {
      await request(app.getHttpServer()).get(path).set(headers(organizationA)).expect(404).expect((response) => {
        expect(response.body).toMatchObject({ code: 'BUSINESS_NOT_FOUND' });
      });
    }

    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/locations/${location.id}/deactivate`).set(headers(organizationA)).expect(404).expect((response) => expect(response.body).toMatchObject({ code: 'LOCATION_NOT_FOUND' }));
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/services/${service.id}/archive`).set(headers(organizationA)).expect(404).expect((response) => expect(response.body).toMatchObject({ code: 'SERVICE_NOT_FOUND' }));
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories`).set(headers(organizationA)).send({ name: 'Wrong Parent', slug: 'wrong-parent', parentCategoryId: category.id }).expect(422).expect((response) => expect(response.body).toMatchObject({ code: 'INVALID_PARENT_CATEGORY' }));
    await request(app.getHttpServer()).put(`/api/v1/businesses/${businessA.id}/policies/service.other`).set(headers(organizationA)).send({ policyValueJson: { enabled: false } }).expect(404).expect((response) => expect(response.body).toMatchObject({ code: 'POLICY_NOT_FOUND' }));
  });

  it('rejects category, service, and policy operations under a different business context', async () => {
    const businessA = await createBusiness(app, organizationA, 'mutation-scope-a');
    const businessB = await createBusiness(app, organizationA, 'mutation-scope-b');
    const category = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/service-categories`).set(headers(organizationA)).send({ name: 'Scoped Category', slug: 'scoped-category' }).expect(201)).body as CategoryResponse;
    const service = (await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/services`).set(headers(organizationA)).send({ categoryId: category.id, name: 'Scoped Service', slug: 'scoped-service', durationMinutes: 30 }).expect(201)).body as ServiceResponse;
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessB.id}/policies`).set(headers(organizationA)).send({ policyKey: 'service.scoped', policyValueJson: { enabled: true } }).expect(201);

    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessB.id}/service-categories`).set(headers(organizationA)).expect(200);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${businessA.id}/service-categories`).set(headers(organizationA)).send({ name: 'Wrong Parent', slug: 'wrong-parent', parentCategoryId: category.id }).expect(422).expect((response) => expect(response.body).toMatchObject({ code: 'INVALID_PARENT_CATEGORY' }));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessB.id}/services`).set(headers(organizationA)).expect(200);
    await request(app.getHttpServer()).patch(`/api/v1/businesses/${businessA.id}/services/${service.id}`).set(headers(organizationA)).send({ name: 'Wrong Service' }).expect(404).expect((response) => expect(response.body).toMatchObject({ code: 'SERVICE_NOT_FOUND' }));
    await request(app.getHttpServer()).get(`/api/v1/businesses/${businessB.id}/policies/service.scoped`).set(headers(organizationA)).expect(200);
    await request(app.getHttpServer()).put(`/api/v1/businesses/${businessA.id}/policies/service.scoped`).set(headers(organizationA)).send({ policyValueJson: { enabled: false } }).expect(404).expect((response) => expect(response.body).toMatchObject({ code: 'POLICY_NOT_FOUND' }));
  });

  it('covers policy persistence concurrency and rejects stale versions', async () => {
    const business = await createBusiness(app, organizationA, 'constraints');
    const category = (await request(app.getHttpServer()).post(`/api/v1/businesses/${business.id}/service-categories`).set(headers(organizationA)).send({ name: 'Root', slug: 'constraints-root' }).expect(201)).body as CategoryResponse;
    await request(app.getHttpServer()).post(`/api/v1/businesses/${business.id}/services`).set(headers(organizationA)).send({ categoryId: category.id, name: 'Service', slug: 'constraints-service', durationMinutes: 30 }).expect(201);
    await request(app.getHttpServer()).post(`/api/v1/businesses/${business.id}/services`).set(headers(organizationA)).send({ categoryId: category.id, name: 'Duplicate', slug: 'constraints-service', durationMinutes: 30 }).expect(409).expect((response) => expect(response.body).toMatchObject({ code: 'SERVICE_SLUG_ALREADY_EXISTS' }));

    await request(app.getHttpServer()).post(`/api/v1/businesses/${business.id}/policies`).set(headers(organizationA)).send({ policyKey: 'service.versioned', policyValueJson: { value: 1 } }).expect(201);
    await request(app.getHttpServer()).put(`/api/v1/businesses/${business.id}/policies/service.versioned`).set(headers(organizationA)).send({ policyValueJson: { value: 2 } }).expect(200);
    const policyRepository = new BusinessPolicyPrismaRepository(prisma);
    await expect(policyRepository.appendVersion({ businessId: business.id, policyKey: 'service.versioned', policyValueJson: { value: 3 } }, 1, { organizationId: organizationA, businessId: business.id })).rejects.toMatchObject({ code: 'POLICY_VERSION_CONFLICT' });
  });

  it('covers policy versions, semantic policy keys, and uniqueness', async () => {
    const business = await createBusiness(app, organizationA, 'policy-a');
    const policy = (await request(app.getHttpServer()).post(`/api/v1/businesses/${business.id}/policies`).set(headers(organizationA)).send({ policyKey: 'service.confirmation', policyValueJson: { required: true } }).expect(201)).body as PolicyResponse;
    expect(policy.version).toBe(1);
    await request(app.getHttpServer()).get(`/api/v1/businesses/${business.id}/policies/service.confirmation`).set(headers(organizationA)).expect(200);
    await request(app.getHttpServer()).put(`/api/v1/businesses/${business.id}/policies/service.confirmation`).set(headers(organizationA)).send({ policyValueJson: { required: false } }).expect(200);
    await request(app.getHttpServer()).get(`/api/v1/businesses/${business.id}/policies/service.confirmation/versions`).set(headers(organizationA)).expect(200).expect((response) => expect(response.body).toHaveLength(2));
    await request(app.getHttpServer()).post(`/api/v1/businesses/${business.id}/policies`).set(headers(organizationA)).send({ policyKey: 'service.confirmation', policyValueJson: { required: true } }).expect(409).expect((response) => {
      expect(response.body).toMatchObject({ code: 'POLICY_KEY_ALREADY_EXISTS' });
    });
    await request(app.getHttpServer()).get(`/api/v1/businesses/${business.id}/policies/Invalid.Key`).set(headers(organizationA)).expect(400);
    const stored = await prisma.businessPolicy.findMany({ where: { businessId: business.id }, orderBy: { version: 'asc' } });
    expect(stored.map((value) => value.version)).toEqual([1, 2]);
  });

  it('rejects invalid identifiers at the real HTTP boundary', async () => {
    await request(app.getHttpServer()).get('/api/v1/businesses/invalid%2Fid').set(headers(organizationA)).expect(400);
    await request(app.getHttpServer()).get('/api/v1/businesses/business-1/policies/service.confirmation').set(headers(organizationA)).expect(404);
  });
});