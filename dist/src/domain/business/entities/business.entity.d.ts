import { BusinessStatus } from '../../shared/business-status.value-object';
export interface BusinessProfileInput {
    name: string;
    description?: string;
    logoUrl?: string;
    contactEmail?: string;
}
export interface BusinessCreateInput {
    slug: string;
    defaultLocale: string;
    supportedLocales: string[];
    timezone: string;
    currency: string;
    profile: BusinessProfileInput;
}
export declare class BusinessProfile {
    readonly id: string;
    readonly businessId: string;
    name: string;
    description?: string;
    logoUrl?: string;
    contactEmail?: string;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(input: {
        id?: string;
        businessId: string;
        name: string;
        description?: string;
        logoUrl?: string;
        contactEmail?: string;
        createdAt?: Date;
        updatedAt?: Date;
    });
    update(input: Partial<Pick<BusinessProfile, 'name' | 'description' | 'logoUrl' | 'contactEmail'>>): void;
}
export declare class Business {
    readonly id: string;
    readonly organizationId: string;
    readonly slug: string;
    readonly defaultLocale: string;
    readonly supportedLocales: string[];
    readonly timezone: string;
    readonly currency: string;
    status: BusinessStatus;
    readonly createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    profile: BusinessProfile;
    events: unknown[];
    constructor(input: {
        id?: string;
        organizationId: string;
        slug: string;
        defaultLocale: string;
        supportedLocales: string[];
        timezone: string;
        currency: string;
        status?: BusinessStatus;
        createdAt?: Date;
        updatedAt?: Date;
        deletedAt?: Date;
        profile: BusinessProfile;
    });
    static create(input: BusinessCreateInput, organizationId: string): Business;
    updateProfile(input: Partial<Pick<BusinessProfile, 'name' | 'description' | 'logoUrl' | 'contactEmail'>>): void;
    validateBusinessScope(organizationId: string): void;
}
