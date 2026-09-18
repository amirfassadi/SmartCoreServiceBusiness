import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BusinessPrismaRepository } from './repositories/business-prisma.repository';
import { BusinessLocationPrismaRepository } from './repositories/business-location-prisma.repository';
import { ServiceCategoryPrismaRepository } from './repositories/service-category-prisma.repository';
import { ServicePrismaRepository } from './repositories/service-prisma.repository';
import { BusinessPolicyPrismaRepository } from './repositories/business-policy-prisma.repository';
import { BUSINESS_REPOSITORY, BUSINESS_LOCATION_REPOSITORY, BUSINESS_POLICY_REPOSITORY, PRISMA_CLIENT, SERVICE_CATEGORY_REPOSITORY, SERVICE_REPOSITORY } from './prisma.tokens';
import { BusinessRepositoryPort } from '../../../domain/business/business.repository.port';
import { BusinessLocationRepositoryPort } from '../../../domain/business-location/business-location.repository.port';
import { ServiceCategoryRepositoryPort } from '../../../domain/service-category/service-category.repository.port';
import { ServiceRepositoryPort } from '../../../domain/service/service.repository.port';
import { BusinessPolicyRepositoryPort } from '../../../domain/business-policy/business-policy.repository.port';

@Global()
@Module({
  providers: [
    {
      provide: PRISMA_CLIENT,
      useFactory: () => new PrismaClient(),
    },
    {
      provide: BUSINESS_REPOSITORY,
      useFactory: (prisma: PrismaClient) => new BusinessPrismaRepository(prisma),
      inject: [PRISMA_CLIENT],
    },
    {
      provide: BUSINESS_LOCATION_REPOSITORY,
      useFactory: (prisma: PrismaClient) => new BusinessLocationPrismaRepository(prisma),
      inject: [PRISMA_CLIENT],
    },
    {
      provide: SERVICE_CATEGORY_REPOSITORY,
      useFactory: (prisma: PrismaClient) => new ServiceCategoryPrismaRepository(prisma),
      inject: [PRISMA_CLIENT],
    },
    {
      provide: SERVICE_REPOSITORY,
      useFactory: (prisma: PrismaClient) => new ServicePrismaRepository(prisma),
      inject: [PRISMA_CLIENT],
    },
    {
      provide: BUSINESS_POLICY_REPOSITORY,
      useFactory: (prisma: PrismaClient) => new BusinessPolicyPrismaRepository(prisma),
      inject: [PRISMA_CLIENT],
    },
  ],
  exports: [
    PRISMA_CLIENT,
    BUSINESS_REPOSITORY,
    BUSINESS_LOCATION_REPOSITORY,
    SERVICE_CATEGORY_REPOSITORY,
    SERVICE_REPOSITORY,
    BUSINESS_POLICY_REPOSITORY,
  ],
})
export class PrismaInfrastructureModule {}
