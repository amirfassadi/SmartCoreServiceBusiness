import { Business } from '../../domain/business/entities/business.entity';
import { BusinessLocation } from '../../domain/business-location/entities/business-location.entity';
import { ServiceCategory } from '../../domain/service-category/entities/service-category.entity';
import { Service } from '../../domain/service/entities/service.entity';
import { BusinessPolicy } from '../../domain/business-policy/entities/business-policy.entity';
export declare function mapBusiness(value: Business): {
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
};
export declare function mapLocation(value: BusinessLocation): {
    id: string;
    businessId: string;
    name: string;
    address: string | undefined;
    timezone: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
};
export declare function mapCategory(value: ServiceCategory): {
    id: string;
    businessId: string;
    name: string;
    slug: string;
    parentCategoryId: string | undefined;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
};
export declare function mapService(value: Service): {
    id: string;
    businessId: string;
    categoryId: string;
    name: string;
    slug: string;
    durationMinutes: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
};
export declare function mapPolicy(value: BusinessPolicy): {
    id: string;
    businessId: string;
    policyKey: string;
    policyValueJson: Record<string, unknown> | null;
    version: number;
    createdAt: Date;
    updatedAt: Date;
};
