import { Body, Controller, Get, Inject, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateBusinessUseCase } from '../../../application/business/create-business.use-case';
import { GetBusinessUseCase } from '../../../application/business/get-business.use-case';
import { UpdateBusinessProfileUseCase } from '../../../application/business/update-business-profile.use-case';
import { AddBusinessLocationUseCase } from '../../../application/business-location/add-business-location.use-case';
import { GetBusinessLocationsUseCase } from '../../../application/business-location/get-business-locations.use-case';
import { UpdateBusinessLocationUseCase } from '../../../application/business-location/update-business-location.use-case';
import { DeactivateBusinessLocationUseCase } from '../../../application/business-location/deactivate-business-location.use-case';
import { CreateServiceCategoryUseCase } from '../../../application/service-category/create-service-category.use-case';
import { GetServiceCategoriesUseCase } from '../../../application/service-category/get-service-categories.use-case';
import { CreateServiceUseCase } from '../../../application/service/create-service.use-case';
import { GetServicesUseCase } from '../../../application/service/get-services.use-case';
import { GetServiceUseCase } from '../../../application/service/get-service.use-case';
import { UpdateServiceUseCase } from '../../../application/service/update-service.use-case';
import { ArchiveServiceUseCase } from '../../../application/service/archive-service.use-case';
import { RestoreServiceUseCase } from '../../../application/service/restore-service.use-case';
import { GetServiceCategoryUseCase } from '../../../application/service-category/get-service-category.use-case';
import { UpdateServiceCategoryUseCase } from '../../../application/service-category/update-service-category.use-case';
import { ArchiveServiceCategoryUseCase } from '../../../application/service-category/archive-service-category.use-case';
import { RestoreServiceCategoryUseCase } from '../../../application/service-category/restore-service-category.use-case';
import { CreateBusinessPolicyUseCase } from '../../../application/business-policy/create-business-policy.use-case';
import { GetCurrentBusinessPolicyUseCase } from '../../../application/business-policy/get-current-business-policy.use-case';
import { GetBusinessPolicyVersionsUseCase } from '../../../application/business-policy/get-business-policy-versions.use-case';
import { UpdateBusinessPolicyUseCase } from '../../../application/business-policy/update-business-policy.use-case';
import { ExternalRequestContextAdapter, ValidatedExternalContext } from '../context/external-request-context';
import { EXTERNAL_REQUEST_CONTEXT } from '../context/request-context.tokens';
import { CreateBusinessDto, UpdateBusinessProfileDto, CreateLocationDto, UpdateLocationDto, CreateServiceCategoryDto, CreateServiceDto, UpdateServiceDto, CreatePolicyDto, UpdatePolicyDto, UpdateServiceCategoryDto, LifecycleQueryDto } from '../dto/phase1.dto';
import { BusinessCreateInput } from '../../../domain/business/entities/business.entity';
import { BusinessLocationInput } from '../../../domain/business-location/entities/business-location.entity';
import { ServiceCategoryInput } from '../../../domain/service-category/entities/service-category.entity';
import { ServiceInput } from '../../../domain/service/entities/service.entity';
import { BusinessPolicyInput } from '../../../domain/business-policy/entities/business-policy.entity';
import { mapBusiness, mapCategory, mapLocation, mapPolicy, mapService } from '../response-mappers';
import { IdentifierPipe } from '../identifier.pipe';

interface RequestWithValidatedContext extends Request {
  validatedContext?: ValidatedExternalContext;
}

@Controller('api/v1/businesses')
@ApiTags('businesses')
export class BusinessController {
  constructor(
    private readonly createBusinessUseCase: CreateBusinessUseCase,
    private readonly getBusinessUseCase: GetBusinessUseCase,
    private readonly updateBusinessProfileUseCase: UpdateBusinessProfileUseCase,
    private readonly addBusinessLocationUseCase: AddBusinessLocationUseCase,
    private readonly getBusinessLocationsUseCase: GetBusinessLocationsUseCase,
    private readonly updateBusinessLocationUseCase: UpdateBusinessLocationUseCase,
    private readonly deactivateBusinessLocationUseCase: DeactivateBusinessLocationUseCase,
    private readonly createServiceCategoryUseCase: CreateServiceCategoryUseCase,
    private readonly getServiceCategoriesUseCase: GetServiceCategoriesUseCase,
    private readonly getServiceCategoryUseCase: GetServiceCategoryUseCase,
    private readonly updateServiceCategoryUseCase: UpdateServiceCategoryUseCase,
    private readonly archiveServiceCategoryUseCase: ArchiveServiceCategoryUseCase,
    private readonly restoreServiceCategoryUseCase: RestoreServiceCategoryUseCase,
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly getServicesUseCase: GetServicesUseCase,
    private readonly getServiceUseCase: GetServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly archiveServiceUseCase: ArchiveServiceUseCase,
    private readonly restoreServiceUseCase: RestoreServiceUseCase,
    private readonly createBusinessPolicyUseCase: CreateBusinessPolicyUseCase,
    private readonly getCurrentBusinessPolicyUseCase: GetCurrentBusinessPolicyUseCase,
    private readonly getBusinessPolicyVersionsUseCase: GetBusinessPolicyVersionsUseCase,
    private readonly updateBusinessPolicyUseCase: UpdateBusinessPolicyUseCase,
    @Inject(EXTERNAL_REQUEST_CONTEXT) private readonly contextAdapter: ExternalRequestContextAdapter,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a Business and its initial profile' })
  @ApiCreatedResponse({ description: 'Business created.' })
  create(@Body() body: CreateBusinessDto, @Req() request: RequestWithValidatedContext) {
    const input: BusinessCreateInput = {
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
    return this.createBusinessUseCase.execute(input, this.contextAdapter.getValidatedContext(request.validatedContext, 'new-business')).then(mapBusiness);
  }

  @Get(':businessId')
  @ApiOperation({ summary: 'Get a Business and profile' })
  @ApiOkResponse({ description: 'Business returned.' })
  get(@Param('businessId', IdentifierPipe) businessId: string, @Req() request: RequestWithValidatedContext) {
    return this.getBusinessUseCase.execute(businessId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapBusiness);
  }

  @Patch(':businessId/profile')
  @ApiOperation({ summary: 'Update a Business profile' })
  @ApiOkResponse({ description: 'Profile updated.' })
  updateProfile(@Param('businessId', IdentifierPipe) businessId: string, @Body() body: UpdateBusinessProfileDto, @Req() request: RequestWithValidatedContext) {
    return this.updateBusinessProfileUseCase.execute(businessId, body, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapBusiness);
  }

  @Post(':businessId/locations')
  addLocation(@Param('businessId', IdentifierPipe) businessId: string, @Body() body: CreateLocationDto, @Req() request: RequestWithValidatedContext) {
    const input: BusinessLocationInput = { ...body, businessId };
    return this.addBusinessLocationUseCase.execute(input, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapLocation);
  }

  @Get(':businessId/locations')
  getLocations(@Param('businessId', IdentifierPipe) businessId: string, @Req() request: RequestWithValidatedContext) {
    return this.getBusinessLocationsUseCase.execute(businessId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then((values) => values.map(mapLocation));
  }

  @Patch(':businessId/locations/:locationId')
  updateLocation(@Param('businessId', IdentifierPipe) businessId: string, @Param('locationId', IdentifierPipe) locationId: string, @Body() body: UpdateLocationDto, @Req() request: RequestWithValidatedContext) {
    return this.updateBusinessLocationUseCase.execute(locationId, { ...body, businessId }, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapLocation);
  }

  @Post(':businessId/locations/:locationId/deactivate')
  deactivateLocation(@Param('businessId', IdentifierPipe) businessId: string, @Param('locationId', IdentifierPipe) locationId: string, @Req() request: RequestWithValidatedContext) {
    return this.deactivateBusinessLocationUseCase.execute(locationId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapLocation);
  }

  @Post(':businessId/service-categories')
  createCategory(@Param('businessId', IdentifierPipe) businessId: string, @Body() body: CreateServiceCategoryDto, @Req() request: RequestWithValidatedContext) {
    const input: ServiceCategoryInput = { ...body, businessId };
    return this.createServiceCategoryUseCase.execute(input, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapCategory);
  }

  @Get(':businessId/service-categories')
  getCategories(@Param('businessId', IdentifierPipe) businessId: string, @Req() request: RequestWithValidatedContext, @Query() query: LifecycleQueryDto = new LifecycleQueryDto()) {
    return this.getServiceCategoriesUseCase.execute(this.contextAdapter.getValidatedContext(request.validatedContext, businessId), query.status).then((values) => values.map(mapCategory));
  }

  @Get(':businessId/service-categories/:categoryId')
  getCategory(@Param('businessId', IdentifierPipe) businessId: string, @Param('categoryId', IdentifierPipe) categoryId: string, @Req() request: RequestWithValidatedContext) {
    return this.getServiceCategoryUseCase.execute(categoryId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapCategory);
  }

  @Patch(':businessId/service-categories/:categoryId')
  updateCategory(@Param('businessId', IdentifierPipe) businessId: string, @Param('categoryId', IdentifierPipe) categoryId: string, @Body() body: UpdateServiceCategoryDto, @Req() request: RequestWithValidatedContext) {
    return this.updateServiceCategoryUseCase.execute(categoryId, body, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapCategory);
  }

  @Post(':businessId/service-categories/:categoryId/archive')
  archiveCategory(@Param('businessId', IdentifierPipe) businessId: string, @Param('categoryId', IdentifierPipe) categoryId: string, @Req() request: RequestWithValidatedContext) {
    return this.archiveServiceCategoryUseCase.execute(categoryId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapCategory);
  }

  @Post(':businessId/service-categories/:categoryId/restore')
  restoreCategory(@Param('businessId', IdentifierPipe) businessId: string, @Param('categoryId', IdentifierPipe) categoryId: string, @Req() request: RequestWithValidatedContext) {
    return this.restoreServiceCategoryUseCase.execute(categoryId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapCategory);
  }

  @Post(':businessId/services')
  createService(@Param('businessId', IdentifierPipe) businessId: string, @Body() body: CreateServiceDto, @Req() request: RequestWithValidatedContext) {
    const input: ServiceInput = { ...body, businessId };
    return this.createServiceUseCase.execute(input, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapService);
  }

  @Get(':businessId/services')
  getServices(@Param('businessId', IdentifierPipe) businessId: string, @Req() request: RequestWithValidatedContext, @Query() query: LifecycleQueryDto = new LifecycleQueryDto()) {
    return this.getServicesUseCase.execute(this.contextAdapter.getValidatedContext(request.validatedContext, businessId), query.status).then((values) => values.map(mapService));
  }

  @Get(':businessId/services/:serviceId')
  getService(@Param('businessId', IdentifierPipe) businessId: string, @Param('serviceId', IdentifierPipe) serviceId: string, @Req() request: RequestWithValidatedContext) {
    return this.getServiceUseCase.execute(serviceId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapService);
  }

  @Patch(':businessId/services/:serviceId')
  updateService(@Param('businessId', IdentifierPipe) businessId: string, @Param('serviceId', IdentifierPipe) serviceId: string, @Body() body: UpdateServiceDto, @Req() request: RequestWithValidatedContext) {
    return this.updateServiceUseCase.execute(serviceId, body, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapService);
  }

  @Post(':businessId/services/:serviceId/archive')
  archiveService(@Param('businessId', IdentifierPipe) businessId: string, @Param('serviceId', IdentifierPipe) serviceId: string, @Req() request: RequestWithValidatedContext) {
    return this.archiveServiceUseCase.execute(serviceId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapService);
  }

  @Post(':businessId/services/:serviceId/restore')
  restoreService(@Param('businessId', IdentifierPipe) businessId: string, @Param('serviceId', IdentifierPipe) serviceId: string, @Req() request: RequestWithValidatedContext) {
    return this.restoreServiceUseCase.execute(serviceId, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapService);
  }

  @Post(':businessId/policies')
  createPolicy(@Param('businessId', IdentifierPipe) businessId: string, @Body() body: CreatePolicyDto, @Req() request: RequestWithValidatedContext) {
    const input: BusinessPolicyInput = { ...body, businessId };
    return this.createBusinessPolicyUseCase.execute(input, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapPolicy);
  }

  @Get(':businessId/policies/:policyKey')
  getCurrentPolicy(@Param('businessId', IdentifierPipe) businessId: string, @Param('policyKey', IdentifierPipe) policyKey: string, @Req() request: RequestWithValidatedContext) {
    return this.getCurrentBusinessPolicyUseCase.execute(policyKey, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapPolicy);
  }

  @Get(':businessId/policies/:policyKey/versions')
  getPolicyVersions(@Param('businessId', IdentifierPipe) businessId: string, @Param('policyKey', IdentifierPipe) policyKey: string, @Req() request: RequestWithValidatedContext) {
    return this.getBusinessPolicyVersionsUseCase.execute(policyKey, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then((values) => values.map(mapPolicy));
  }

  @Put(':businessId/policies/:policyKey')
  updatePolicy(@Param('businessId', IdentifierPipe) businessId: string, @Param('policyKey', IdentifierPipe) policyKey: string, @Body() body: UpdatePolicyDto, @Req() request: RequestWithValidatedContext) {
    return this.updateBusinessPolicyUseCase.execute(policyKey, body.policyValueJson, this.contextAdapter.getValidatedContext(request.validatedContext, businessId)).then(mapPolicy);
  }
}
