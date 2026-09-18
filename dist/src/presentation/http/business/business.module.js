"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessModule = exports.BUSINESS_POLICY_REPOSITORY = exports.SERVICE_REPOSITORY = exports.SERVICE_CATEGORY_REPOSITORY = exports.BUSINESS_LOCATION_REPOSITORY = exports.BUSINESS_REPOSITORY = void 0;
const common_1 = require("@nestjs/common");
const business_controller_1 = require("./business.controller");
const create_business_use_case_1 = require("../../../application/business/create-business.use-case");
const get_business_use_case_1 = require("../../../application/business/get-business.use-case");
const update_business_profile_use_case_1 = require("../../../application/business/update-business-profile.use-case");
const client_1 = require("@prisma/client");
const business_prisma_repository_1 = require("../../../infrastructure/persistence/prisma/repositories/business-prisma.repository");
const business_location_prisma_repository_1 = require("../../../infrastructure/persistence/prisma/repositories/business-location-prisma.repository");
const service_category_prisma_repository_1 = require("../../../infrastructure/persistence/prisma/repositories/service-category-prisma.repository");
const service_prisma_repository_1 = require("../../../infrastructure/persistence/prisma/repositories/service-prisma.repository");
const business_policy_prisma_repository_1 = require("../../../infrastructure/persistence/prisma/repositories/business-policy-prisma.repository");
const add_business_location_use_case_1 = require("../../../application/business-location/add-business-location.use-case");
const get_business_locations_use_case_1 = require("../../../application/business-location/get-business-locations.use-case");
const update_business_location_use_case_1 = require("../../../application/business-location/update-business-location.use-case");
const deactivate_business_location_use_case_1 = require("../../../application/business-location/deactivate-business-location.use-case");
const create_service_category_use_case_1 = require("../../../application/service-category/create-service-category.use-case");
const get_service_categories_use_case_1 = require("../../../application/service-category/get-service-categories.use-case");
const create_service_use_case_1 = require("../../../application/service/create-service.use-case");
const get_services_use_case_1 = require("../../../application/service/get-services.use-case");
const update_service_use_case_1 = require("../../../application/service/update-service.use-case");
const archive_service_use_case_1 = require("../../../application/service/archive-service.use-case");
const create_business_policy_use_case_1 = require("../../../application/business-policy/create-business-policy.use-case");
const get_current_business_policy_use_case_1 = require("../../../application/business-policy/get-current-business-policy.use-case");
const get_business_policy_versions_use_case_1 = require("../../../application/business-policy/get-business-policy-versions.use-case");
const update_business_policy_use_case_1 = require("../../../application/business-policy/update-business-policy.use-case");
const external_request_context_1 = require("../context/external-request-context");
const request_context_tokens_1 = require("../context/request-context.tokens");
exports.BUSINESS_REPOSITORY = Symbol('BUSINESS_REPOSITORY');
exports.BUSINESS_LOCATION_REPOSITORY = Symbol('BUSINESS_LOCATION_REPOSITORY');
exports.SERVICE_CATEGORY_REPOSITORY = Symbol('SERVICE_CATEGORY_REPOSITORY');
exports.SERVICE_REPOSITORY = Symbol('SERVICE_REPOSITORY');
exports.BUSINESS_POLICY_REPOSITORY = Symbol('BUSINESS_POLICY_REPOSITORY');
let BusinessModule = class BusinessModule {
};
exports.BusinessModule = BusinessModule;
exports.BusinessModule = BusinessModule = __decorate([
    (0, common_1.Module)({
        controllers: [business_controller_1.BusinessController],
        providers: [
            client_1.PrismaClient,
            { provide: request_context_tokens_1.EXTERNAL_REQUEST_CONTEXT, useClass: external_request_context_1.HeaderExternalRequestContextAdapter },
            { provide: exports.BUSINESS_REPOSITORY, useFactory: (prisma) => new business_prisma_repository_1.BusinessPrismaRepository(prisma), inject: [client_1.PrismaClient] },
            { provide: exports.BUSINESS_LOCATION_REPOSITORY, useFactory: (prisma) => new business_location_prisma_repository_1.BusinessLocationPrismaRepository(prisma), inject: [client_1.PrismaClient] },
            { provide: exports.SERVICE_CATEGORY_REPOSITORY, useFactory: (prisma) => new service_category_prisma_repository_1.ServiceCategoryPrismaRepository(prisma), inject: [client_1.PrismaClient] },
            { provide: exports.SERVICE_REPOSITORY, useFactory: (prisma) => new service_prisma_repository_1.ServicePrismaRepository(prisma), inject: [client_1.PrismaClient] },
            { provide: exports.BUSINESS_POLICY_REPOSITORY, useFactory: (prisma) => new business_policy_prisma_repository_1.BusinessPolicyPrismaRepository(prisma), inject: [client_1.PrismaClient] },
            { provide: create_business_use_case_1.CreateBusinessUseCase, useFactory: (repository) => new create_business_use_case_1.CreateBusinessUseCase(repository), inject: [exports.BUSINESS_REPOSITORY] },
            { provide: get_business_use_case_1.GetBusinessUseCase, useFactory: (repository) => new get_business_use_case_1.GetBusinessUseCase(repository), inject: [exports.BUSINESS_REPOSITORY] },
            { provide: update_business_profile_use_case_1.UpdateBusinessProfileUseCase, useFactory: (repository) => new update_business_profile_use_case_1.UpdateBusinessProfileUseCase(repository), inject: [exports.BUSINESS_REPOSITORY] },
            { provide: add_business_location_use_case_1.AddBusinessLocationUseCase, useFactory: (business, location) => new add_business_location_use_case_1.AddBusinessLocationUseCase(business, location), inject: [exports.BUSINESS_REPOSITORY, exports.BUSINESS_LOCATION_REPOSITORY] },
            { provide: get_business_locations_use_case_1.GetBusinessLocationsUseCase, useFactory: (location) => new get_business_locations_use_case_1.GetBusinessLocationsUseCase(location), inject: [exports.BUSINESS_LOCATION_REPOSITORY] },
            { provide: update_business_location_use_case_1.UpdateBusinessLocationUseCase, useFactory: (business, location) => new update_business_location_use_case_1.UpdateBusinessLocationUseCase(business, location), inject: [exports.BUSINESS_REPOSITORY, exports.BUSINESS_LOCATION_REPOSITORY] },
            { provide: deactivate_business_location_use_case_1.DeactivateBusinessLocationUseCase, useFactory: (business, location) => new deactivate_business_location_use_case_1.DeactivateBusinessLocationUseCase(business, location), inject: [exports.BUSINESS_REPOSITORY, exports.BUSINESS_LOCATION_REPOSITORY] },
            { provide: create_service_category_use_case_1.CreateServiceCategoryUseCase, useFactory: (business, category) => new create_service_category_use_case_1.CreateServiceCategoryUseCase(business, category), inject: [exports.BUSINESS_REPOSITORY, exports.SERVICE_CATEGORY_REPOSITORY] },
            { provide: get_service_categories_use_case_1.GetServiceCategoriesUseCase, useFactory: (business, category) => new get_service_categories_use_case_1.GetServiceCategoriesUseCase(business, category), inject: [exports.BUSINESS_REPOSITORY, exports.SERVICE_CATEGORY_REPOSITORY] },
            { provide: create_service_use_case_1.CreateServiceUseCase, useFactory: (business, service) => new create_service_use_case_1.CreateServiceUseCase(business, service), inject: [exports.BUSINESS_REPOSITORY, exports.SERVICE_REPOSITORY] },
            { provide: get_services_use_case_1.GetServicesUseCase, useFactory: (business, service) => new get_services_use_case_1.GetServicesUseCase(business, service), inject: [exports.BUSINESS_REPOSITORY, exports.SERVICE_REPOSITORY] },
            { provide: update_service_use_case_1.UpdateServiceUseCase, useFactory: (business, service) => new update_service_use_case_1.UpdateServiceUseCase(business, service), inject: [exports.BUSINESS_REPOSITORY, exports.SERVICE_REPOSITORY] },
            { provide: archive_service_use_case_1.ArchiveServiceUseCase, useFactory: (business, service) => new archive_service_use_case_1.ArchiveServiceUseCase(business, service), inject: [exports.BUSINESS_REPOSITORY, exports.SERVICE_REPOSITORY] },
            { provide: create_business_policy_use_case_1.CreateBusinessPolicyUseCase, useFactory: (business, policy) => new create_business_policy_use_case_1.CreateBusinessPolicyUseCase(business, policy), inject: [exports.BUSINESS_REPOSITORY, exports.BUSINESS_POLICY_REPOSITORY] },
            { provide: get_current_business_policy_use_case_1.GetCurrentBusinessPolicyUseCase, useFactory: (business, policy) => new get_current_business_policy_use_case_1.GetCurrentBusinessPolicyUseCase(business, policy), inject: [exports.BUSINESS_REPOSITORY, exports.BUSINESS_POLICY_REPOSITORY] },
            { provide: get_business_policy_versions_use_case_1.GetBusinessPolicyVersionsUseCase, useFactory: (business, policy) => new get_business_policy_versions_use_case_1.GetBusinessPolicyVersionsUseCase(business, policy), inject: [exports.BUSINESS_REPOSITORY, exports.BUSINESS_POLICY_REPOSITORY] },
            { provide: update_business_policy_use_case_1.UpdateBusinessPolicyUseCase, useFactory: (business, policy) => new update_business_policy_use_case_1.UpdateBusinessPolicyUseCase(business, policy), inject: [exports.BUSINESS_REPOSITORY, exports.BUSINESS_POLICY_REPOSITORY] },
        ],
    })
], BusinessModule);
