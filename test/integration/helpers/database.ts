import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

const testDatabaseName = 'smartcore_service_business_test';
const runId = randomUUID().replace(/-/g, '').slice(0, 12);
const fixturePrefix = `integration-fixture-${runId}-`;

function getTestDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL_TEST;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL_TEST must be set to the dedicated integration database URL.');
  }

  const databaseName = new URL(databaseUrl).pathname.replace(/^\//, '');
  if (databaseName !== testDatabaseName) {
    throw new Error(`Integration tests require database ${testDatabaseName}.`);
  }

  return databaseUrl;
}

export function createTestPrisma(): PrismaClient {
  const databaseUrl = getTestDatabaseUrl();
  process.env.DATABASE_URL = databaseUrl;
  return new PrismaClient();
}

export async function cleanFixtures(prisma: PrismaClient): Promise<void> {
  const businesses = await prisma.business.findMany({
    where: { slug: { startsWith: fixturePrefix } },
    select: { id: true },
  });
  const businessIds = businesses.map(({ id }) => id);

  if (businessIds.length === 0) return;

  await prisma.businessPolicy.deleteMany({ where: { businessId: { in: businessIds } } });
  await prisma.service.deleteMany({ where: { businessId: { in: businessIds } } });
  await prisma.serviceCategory.deleteMany({ where: { businessId: { in: businessIds } } });
  await prisma.businessLocation.deleteMany({ where: { businessId: { in: businessIds } } });
  await prisma.businessProfile.deleteMany({ where: { businessId: { in: businessIds } } });
  await prisma.business.deleteMany({ where: { id: { in: businessIds } } });
}

export { fixturePrefix };