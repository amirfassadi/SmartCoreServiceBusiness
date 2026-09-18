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
import { UpdateServiceUseCase } from '../../../application/service/update-service.use-case';
import { ArchiveServiceUseCase } from '../../../application/service/archive-service.use-case';
import { CreateBusinessPolicyUseCase } from '../../../application/business-policy/create-business-policy.use-case';
import { GetCurrentBusinessPolicyUseCase } from '../../../application/business-policy/get-current-business-policy.use-case';
import { GetBusinessPolicyVersionsUseCase } from '../../../application/business-policy/get-business-policy-versions.use-case';
import { UpdateBusinessPolicyUseCase } from '../../../application/business-policy/update-business-policy.use-case';
import { ExternalRequestContextAdapter, ValidatedExternalContext } from '../context/external-request-context';
import { CreateBusinessDto, UpdateBusinessProfileDto, CreateLocationDto, UpdateLocationDto, CreateServiceCategoryDto, CreateServiceDto, UpdateServiceDto, CreatePolicyDto, UpdatePolicyDto } from '../dto/phase1.dto';
interface RequestWithValidatedContext extends Request {
    validatedContext?: ValidatedExternalContext;
}
export declare class BusinessController {
    private readonly createBusinessUseCase;
    private readonly getBusinessUseCase;
    private readonly updateBusinessProfileUseCase;
    private readonly addBusinessLocationUseCase;
    private readonly getBusinessLocationsUseCase;
    private readonly updateBusinessLocationUseCase;
    private readonly deactivateBusinessLocationUseCase;
    private readonly createServiceCategoryUseCase;
    private readonly getServiceCategoriesUseCase;
    private readonly createServiceUseCase;
    private readonly getServicesUseCase;
    private readonly updateServiceUseCase;
    private readonly archiveServiceUseCase;
    private readonly createBusinessPolicyUseCase;
    private readonly getCurrentBusinessPolicyUseCase;
    private readonly getBusinessPolicyVersionsUseCase;
    private readonly updateBusinessPolicyUseCase;
    private readonly contextAdapter;
    constructor(createBusinessUseCase: CreateBusinessUseCase, getBusinessUseCase: GetBusinessUseCase, updateBusinessProfileUseCase: UpdateBusinessProfileUseCase, addBusinessLocationUseCase: AddBusinessLocationUseCase, getBusinessLocationsUseCase: GetBusinessLocationsUseCase, updateBusinessLocationUseCase: UpdateBusinessLocationUseCase, deactivateBusinessLocationUseCase: DeactivateBusinessLocationUseCase, createServiceCategoryUseCase: CreateServiceCategoryUseCase, getServiceCategoriesUseCase: GetServiceCategoriesUseCase, createServiceUseCase: CreateServiceUseCase, getServicesUseCase: GetServicesUseCase, updateServiceUseCase: UpdateServiceUseCase, archiveServiceUseCase: ArchiveServiceUseCase, createBusinessPolicyUseCase: CreateBusinessPolicyUseCase, getCurrentBusinessPolicyUseCase: GetCurrentBusinessPolicyUseCase, getBusinessPolicyVersionsUseCase: GetBusinessPolicyVersionsUseCase, updateBusinessPolicyUseCase: UpdateBusinessPolicyUseCase, contextAdapter: ExternalRequestContextAdapter);
    create(body: CreateBusinessDto, request: RequestWithValidatedContext): Promise<{
        id: string;
        organizationId: string;
        slug: string;
        defaultLocale: string;
        supportedLocales: string[];
        timezone: string;
        currency: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | undefined;
        profile: {
            id: string;
            businessId: string;
            name: string;
            description: string | undefined;
            logoUrl: string | undefined;
            contactEmail: string | undefined;
            createdAt: Date;
            updatedAt: Date;
        } | undefined;
    }>;
    get(businessId: string, request: RequestWithValidatedContext): Promise<{
        id: string;
        slug: string;
        organizationId: string;
    }>;
    updateProfile(businessId: string, body: UpdateBusinessProfileDto, request: RequestWithValidatedContext): Promise<{
        id: string;
        organizationId: string;
        slug: string;
        defaultLocale: string;
        supportedLocales: string[];
        timezone: string;
        currency: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | undefined;
        profile: {
            id: string;
            businessId: string;
            name: string;
            description: string | undefined;
            logoUrl: string | undefined;
            contactEmail: string | undefined;
            createdAt: Date;
            updatedAt: Date;
        } | undefined;
    }>;
    addLocation(businessId: string, body: CreateLocationDto, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        name: string;
        address: string | undefined;
        timezone: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getLocations(businessId: string, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        name: string;
        address: string | undefined;
        timezone: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateLocation(businessId: string, locationId: string, body: UpdateLocationDto, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        name: string;
        address: string | undefined;
        timezone: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deactivateLocation(businessId: string, locationId: string, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        name: string;
        address: string | undefined;
        timezone: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createCategory(businessId: string, body: CreateServiceCategoryDto, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        name: string;
        slug: string;
        parentCategoryId: string | undefined;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCategories(businessId: string, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        name: string;
        slug: string;
        parentCategoryId: string | undefined;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createService(businessId: string, body: CreateServiceDto, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        categoryId: string;
        name: string;
        slug: string;
        durationMinutes: number;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getServices(businessId: string, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        categoryId: string;
        name: string;
        slug: string;
        durationMinutes: number;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateService(businessId: string, serviceId: string, body: UpdateServiceDto, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        categoryId: string;
        name: string;
        slug: string;
        durationMinutes: number;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    archiveService(businessId: string, serviceId: string, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        categoryId: string;
        name: string;
        slug: string;
        durationMinutes: number;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createPolicy(businessId: string, body: CreatePolicyDto, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        policyKey: string;
        policyValueJson: Record<string, unknown> | null;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCurrentPolicy(businessId: string, policyKey: string, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        policyKey: string;
        policyValueJson: Record<string, unknown> | null;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPolicyVersions(businessId: string, policyKey: string, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        policyKey: string;
        policyValueJson: Record<string, unknown> | null;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updatePolicy(businessId: string, policyKey: string, body: UpdatePolicyDto, request: RequestWithValidatedContext): Promise<{
        id: string;
        businessId: string;
        policyKey: string;
        policyValueJson: Record<string, unknown> | null;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
