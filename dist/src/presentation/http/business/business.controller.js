"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessController = void 0;
const common_1 = require("@nestjs/common");
const create_business_use_case_1 = require("../../../application/business/create-business.use-case");
const get_business_use_case_1 = require("../../../application/business/get-business.use-case");
const update_business_profile_use_case_1 = require("../../../application/business/update-business-profile.use-case");
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
const request_context_tokens_1 = require("../context/request-context.tokens");
const phase1_dto_1 = require("../dto/phase1.dto");
const response_mappers_1 = require("../response-mappers");
const identifier_pipe_1 = require("../identifier.pipe");
let BusinessController = class BusinessController {
    createBusinessUseCase;
    getBusinessUseCase;
    updateBusinessProfileUseCase;
    addBusinessLocationUseCase;
    getBusinessLocationsUseCase;
    updateBusinessLocationUseCase;
    deactivateBusinessLocationUseCase;
    createServiceCategoryUseCase;
    getServiceCategoriesUseCase;
    createServiceUseCase;
    getServicesUseCase;
    updateServiceUseCase;
    archiveServiceUseCase;
    createBusinessPolicyUseCase;
    getCurrentBusinessPolicyUseCase;
    getBusinessPolicyVersionsUseCase;
    updateBusinessPolicyUseCase;
    contextAdapter;
    constructor(createBusinessUseCase, getBusinessUseCase, updateBusinessProfileUseCase, addBusinessLocationUseCase, getBusinessLocationsUseCase, updateBusinessLocationUseCase, deactivateBusinessLocationUseCase, createServiceCategoryUseCase, getServiceCategoriesUseCase, createServiceUseCase, getServicesUseCase, updateServiceUseCase, archiveServiceUseCase, createBusinessPolicyUseCase, getCurrentBusinessPolicyUseCase, getBusinessPolicyVersionsUseCase, updateBusinessPolicyUseCase, contextAdapter) {
        this.createBusinessUseCase = createBusinessUseCase;
        this.getBusinessUseCase = getBusinessUseCase;
        this.updateBusinessProfileUseCase = updateBusinessProfileUseCase;
        this.addBusinessLocationUseCase = addBusinessLocationUseCase;
        this.getBusinessLocationsUseCase = getBusinessLocationsUseCase;
        this.updateBusinessLocationUseCase = updateBusinessLocationUseCase;
        this.deactivateBusinessLocationUseCase = deactivateBusinessLocationUseCase;
        this.createServiceCategoryUseCase = createServiceCategoryUseCase;
        this.getServiceCategoriesUseCase = getServiceCategoriesUseCase;
        this.createServiceUseCase = createServiceUseCase;
        this.getServicesUseCase = getServicesUseCase;
        this.updateServiceUseCase = updateServiceUseCase;
        this.archiveServiceUseCase = archiveServiceUseCase;
        this.createBusinessPolicyUseCase = createBusinessPolicyUseCase;
        this.getCurrentBusinessPolicyUseCase = getCurrentBusinessPolicyUseCase;
        this.getBusinessPolicyVersionsUseCase = getBusinessPolicyVersionsUseCase;
        this.updateBusinessPolicyUseCase = updateBusinessPolicyUseCase;
        this.contextAdapter = contextAdapter;
    }
    create(body, request) {
        const input = {
            slug: body.slug,
            defaultLocale: body.defaultLocale,
            supportedLocales: body.supportedLocales,
            timezone: body.timezone,
            currency: body.currency,
            profile: {
                name: body.profileName,
                description: body.profileDescription,
                logoUrl: body.profileLogoUrl,
                contactEmail: body.profileContactEmail,
            },
        };
        return this.createBusinessUseCase.execute(input, this.contextAdapter.getValidatedContext(request.validatedContext, 'new-business')).then(response_mappers_1.mapBusiness);
    }
    get(businessId, request) {
        return this.getBusinessUseCase.execute(businessId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId));
    }
    updateProfile(businessId, body, request) {
        return this.updateBusinessProfileUseCase.execute(businessId, body, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(response_mappers_1.mapBusiness);
    }
    addLocation(businessId, body, request) {
        const input = { ...body, businessId };
        return this.addBusinessLocationUseCase.execute(input, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(response_mappers_1.mapLocation);
    }
    getLocations(businessId, request) {
        return this.getBusinessLocationsUseCase.execute(businessId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then((values) => values.map(response_mappers_1.mapLocation));
    }
    updateLocation(businessId, locationId, body, request) {
        return this.updateBusinessLocationUseCase.execute(locationId, { ...body, businessId }, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(response_mappers_1.mapLocation);
    }
    deactivateLocation(businessId, locationId, request) {
        return this.deactivateBusinessLocationUseCase.execute(locationId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(response_mappers_1.mapLocation);
    }
    createCategory(businessId, body, request) {
        const input = { ...body, businessId };
        return this.createServiceCategoryUseCase.execute(input, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(response_mappers_1.mapCategory);
    }
    getCategories(businessId, request) {
        return this.getServiceCategoriesUseCase.execute(this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then((values) => values.map(response_mappers_1.mapCategory));
    }
    createService(businessId, body, request) {
        const input = { ...body, businessId };
        return this.createServiceUseCase.execute(input, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(response_mappers_1.mapService);
    }
    getServices(businessId, request) {
        return this.getServicesUseCase.execute(this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then((values) => values.map(response_mappers_1.mapService));
    }
    updateService(businessId, serviceId, body, request) {
        return this.updateServiceUseCase.execute(serviceId, body, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(response_mappers_1.mapService);
    }
    archiveService(businessId, serviceId, request) {
        return this.archiveServiceUseCase.execute(serviceId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(response_mappers_1.mapService);
    }
    createPolicy(businessId, body, request) {
        const input = { ...body, businessId };
        return this.createBusinessPolicyUseCase.execute(input, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(response_mappers_1.mapPolicy);
    }
    getCurrentPolicy(businessId, policyKey, request) {
        return this.getCurrentBusinessPolicyUseCase.execute(policyKey, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(response_mappers_1.mapPolicy);
    }
    getPolicyVersions(businessId, policyKey, request) {
        return this.getBusinessPolicyVersionsUseCase.execute(policyKey, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then((values) => values.map(response_mappers_1.mapPolicy));
    }
    updatePolicy(businessId, policyKey, body, request) {
        return this.updateBusinessPolicyUseCase.execute(policyKey, body.policyValueJson, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(response_mappers_1.mapPolicy);
    }
};
exports.BusinessController = BusinessController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phase1_dto_1.CreateBusinessDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':businessId'),
    __param(0, (0, common_1.Param)('businessId', identifier_pipe_1.IdentifierPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':businessId/profile'),
    __param(0, (0, common_1.Param)('businessId', identifier_pipe_1.IdentifierPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, phase1_dto_1.UpdateBusinessProfileDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)(':businessId/locations'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, phase1_dto_1.CreateLocationDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "addLocation", null);
__decorate([
    (0, common_1.Get)(':businessId/locations'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Patch)(':businessId/locations/:locationId'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('locationId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, phase1_dto_1.UpdateLocationDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Post)(':businessId/locations/:locationId/deactivate'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('locationId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "deactivateLocation", null);
__decorate([
    (0, common_1.Post)(':businessId/service-categories'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, phase1_dto_1.CreateServiceCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)(':businessId/service-categories'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)(':businessId/services'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, phase1_dto_1.CreateServiceDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "createService", null);
__decorate([
    (0, common_1.Get)(':businessId/services'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "getServices", null);
__decorate([
    (0, common_1.Patch)(':businessId/services/:serviceId'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('serviceId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, phase1_dto_1.UpdateServiceDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "updateService", null);
__decorate([
    (0, common_1.Post)(':businessId/services/:serviceId/archive'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('serviceId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "archiveService", null);
__decorate([
    (0, common_1.Post)(':businessId/policies'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, phase1_dto_1.CreatePolicyDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "createPolicy", null);
__decorate([
    (0, common_1.Get)(':businessId/policies/:policyKey'),
    __param(0, (0, common_1.Param)('businessId', identifier_pipe_1.IdentifierPipe)),
    __param(1, (0, common_1.Param)('policyKey', identifier_pipe_1.IdentifierPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "getCurrentPolicy", null);
__decorate([
    (0, common_1.Get)(':businessId/policies/:policyKey/versions'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('policyKey')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "getPolicyVersions", null);
__decorate([
    (0, common_1.Put)(':businessId/policies/:policyKey'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('policyKey')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, phase1_dto_1.UpdatePolicyDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "updatePolicy", null);
exports.BusinessController = BusinessController = __decorate([
    (0, common_1.Controller)('api/v1/businesses'),
    __param(17, (0, common_1.Inject)(request_context_tokens_1.EXTERNAL_REQUEST_CONTEXT)),
    __metadata("design:paramtypes", [create_business_use_case_1.CreateBusinessUseCase,
        get_business_use_case_1.GetBusinessUseCase,
        update_business_profile_use_case_1.UpdateBusinessProfileUseCase,
        add_business_location_use_case_1.AddBusinessLocationUseCase,
        get_business_locations_use_case_1.GetBusinessLocationsUseCase,
        update_business_location_use_case_1.UpdateBusinessLocationUseCase,
        deactivate_business_location_use_case_1.DeactivateBusinessLocationUseCase,
        create_service_category_use_case_1.CreateServiceCategoryUseCase,
        get_service_categories_use_case_1.GetServiceCategoriesUseCase,
        create_service_use_case_1.CreateServiceUseCase,
        get_services_use_case_1.GetServicesUseCase,
        update_service_use_case_1.UpdateServiceUseCase,
        archive_service_use_case_1.ArchiveServiceUseCase,
        create_business_policy_use_case_1.CreateBusinessPolicyUseCase,
        get_current_business_policy_use_case_1.GetCurrentBusinessPolicyUseCase,
        get_business_policy_versions_use_case_1.GetBusinessPolicyVersionsUseCase,
        update_business_policy_use_case_1.UpdateBusinessPolicyUseCase, Object])
], BusinessController);
