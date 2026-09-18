import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { CreateBusinessUseCase } from '../../../application/business/create-business.use-case';
import { GetBusinessUseCase } from '../../../application/business/get-business.use-case';
import { UpdateBusinessProfileUseCase } from '../../../application/business/update-business-profile.use-case';
import { BusinessRepositoryPort } from '../../../domain/business/business.repository.port';
import { BusinessLocationRepositoryPort } from '../../../domain/business-location/business-location.repository.port';
import { ServiceCategoryRepositoryPort } from '../../../domain/service-category/service-category.repository.port';
import { ServiceRepositoryPort } from '../../../domain/service/service.repository.port';
import { BusinessPolicyRepositoryPort } from '../../../domain/business-policy/business-policy.repository.port';
import { AddBusinessLocationUseCase } from '../../../application/business-location/add-business-location.use-case';
import { GetBusinessLocationsUseCase } from '../../../application/business-location/get-business-locations.use-case';
import { UpdateBusinessLocationUseCase } from '../../../application/business-location/update-business-location.use-case';
import { DeactivateBusinessLocationUseCase } from '../../../application/business-location/deactivate-business-location.use-case';
import { CreateServiceCategoryUseCase } from '../../../application/service-category/create-service-category.use-case';
import { GetServiceCategoriesUseCase } from '../../../application/service-category/get-service-categories.use-case';
import { CreateServiceUseCase } from '../../../application/service/create-service.use-case';
import { GetServicesUseCase } from '../../../application/service/get-services.use-case';
import { UpdateServiceUseCase } from '../../../application/service/update-service.use-case';
import { ArchiveServiceUseCase } from '../../../application/service/archive-service.use-case';
import { CreateBusinessPolicyUseCase } from '../../../application/business-policy/create-business-policy.use-case';
import { GetCurrentBusinessPolicyUseCase } from '../../../application/business-policy/get-current-business-policy.use-case';
import { GetBusinessPolicyVersionsUseCase } from '../../../application/business-policy/get-business-policy-versions.use-case';
import { UpdateBusinessPolicyUseCase } from '../../../application/business-policy/update-business-policy.use-case';
import { ValidatedExternalRequestContextAdapter } from '../context/external-request-context';
import { LocalDevelopmentContextMiddleware } from '../context/local-development-context.middleware';
import { EXTERNAL_REQUEST_CONTEXT } from '../context/request-context.tokens';
import { PrismaInfrastructureModule } from '../../../infrastructure/persistence/prisma/prisma.module';
import {
  BUSINESS_REPOSITORY,
  BUSINESS_LOCATION_REPOSITORY,
  SERVICE_CATEGORY_REPOSITORY,
  SERVICE_REPOSITORY,
  BUSINESS_POLICY_REPOSITORY,
} from '../../../infrastructure/persistence/prisma/prisma.tokens';

@Module({
  imports: [PrismaInfrastructureModule],
  controllers: [BusinessController],
  providers: [
    { provide: EXTERNAL_REQUEST_CONTEXT, useClass: ValidatedExternalRequestContextAdapter },
    { provide: CreateBusinessUseCase, useFactory: (repository: BusinessRepositoryPort) => new CreateBusinessUseCase(repository), inject: [BUSINESS_REPOSITORY] },
    { provide: GetBusinessUseCase, useFactory: (repository: BusinessRepositoryPort) => new GetBusinessUseCase(repository), inject: [BUSINESS_REPOSITORY] },
    { provide: UpdateBusinessProfileUseCase, useFactory: (repository: BusinessRepositoryPort) => new UpdateBusinessProfileUseCase(repository), inject: [BUSINESS_REPOSITORY] },
    { provide: AddBusinessLocationUseCase, useFactory: (business: BusinessRepositoryPort, location: BusinessLocationRepositoryPort) => new AddBusinessLocationUseCase(business, location), inject: [BUSINESS_REPOSITORY, BUSINESS_LOCATION_REPOSITORY] },
    { provide: GetBusinessLocationsUseCase, useFactory: (location: BusinessLocationRepositoryPort) => new GetBusinessLocationsUseCase(location), inject: [BUSINESS_LOCATION_REPOSITORY] },
    { provide: UpdateBusinessLocationUseCase, useFactory: (business: BusinessRepositoryPort, location: BusinessLocationRepositoryPort) => new UpdateBusinessLocationUseCase(business, location), inject: [BUSINESS_REPOSITORY, BUSINESS_LOCATION_REPOSITORY] },
    { provide: DeactivateBusinessLocationUseCase, useFactory: (business: BusinessRepositoryPort, location: BusinessLocationRepositoryPort) => new DeactivateBusinessLocationUseCase(business, location), inject: [BUSINESS_REPOSITORY, BUSINESS_LOCATION_REPOSITORY] },
    { provide: CreateServiceCategoryUseCase, useFactory: (business: BusinessRepositoryPort, category: ServiceCategoryRepositoryPort) => new CreateServiceCategoryUseCase(business, category), inject: [BUSINESS_REPOSITORY, SERVICE_CATEGORY_REPOSITORY] },
    { provide: GetServiceCategoriesUseCase, useFactory: (business: BusinessRepositoryPort, category: ServiceCategoryRepositoryPort) => new GetServiceCategoriesUseCase(business, category), inject: [BUSINESS_REPOSITORY, SERVICE_CATEGORY_REPOSITORY] },
    { provide: CreateServiceUseCase, useFactory: (business: BusinessRepositoryPort, service: ServiceRepositoryPort) => new CreateServiceUseCase(business, service), inject: [BUSINESS_REPOSITORY, SERVICE_REPOSITORY] },
    { provide: GetServicesUseCase, useFactory: (business: BusinessRepositoryPort, service: ServiceRepositoryPort) => new GetServicesUseCase(business, service), inject: [BUSINESS_REPOSITORY, SERVICE_REPOSITORY] },
    { provide: UpdateServiceUseCase, useFactory: (business: BusinessRepositoryPort, service: ServiceRepositoryPort) => new UpdateServiceUseCase(business, service), inject: [BUSINESS_REPOSITORY, SERVICE_REPOSITORY] },
    { provide: ArchiveServiceUseCase, useFactory: (business: BusinessRepositoryPort, service: ServiceRepositoryPort) => new ArchiveServiceUseCase(business, service), inject: [BUSINESS_REPOSITORY, SERVICE_REPOSITORY] },
    { provide: CreateBusinessPolicyUseCase, useFactory: (business: BusinessRepositoryPort, policy: BusinessPolicyRepositoryPort) => new CreateBusinessPolicyUseCase(business, policy), inject: [BUSINESS_REPOSITORY, BUSINESS_POLICY_REPOSITORY] },
    { provide: GetCurrentBusinessPolicyUseCase, useFactory: (business: BusinessRepositoryPort, policy: BusinessPolicyRepositoryPort) => new GetCurrentBusinessPolicyUseCase(business, policy), inject: [BUSINESS_REPOSITORY, BUSINESS_POLICY_REPOSITORY] },
    { provide: GetBusinessPolicyVersionsUseCase, useFactory: (business: BusinessRepositoryPort, policy: BusinessPolicyRepositoryPort) => new GetBusinessPolicyVersionsUseCase(business, policy), inject: [BUSINESS_REPOSITORY, BUSINESS_POLICY_REPOSITORY] },
    { provide: UpdateBusinessPolicyUseCase, useFactory: (business: BusinessRepositoryPort, policy: BusinessPolicyRepositoryPort) => new UpdateBusinessPolicyUseCase(business, policy), inject: [BUSINESS_REPOSITORY, BUSINESS_POLICY_REPOSITORY] },
  ],
})
export class BusinessModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    if (process.env.NODE_ENV !== 'production') {
      consumer.apply(LocalDevelopmentContextMiddleware).forRoutes(BusinessController);
    }
  }
}
