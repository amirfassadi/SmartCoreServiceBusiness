export declare class BusinessProfileDto {
    name: string;
    description?: string;
    logoUrl?: string;
    contactEmail?: string;
}
export declare class CreateBusinessDto {
    slug: string;
    defaultLocale: string;
    supportedLocales: string[];
    timezone: string;
    currency: string;
    profileName: string;
    profileDescription?: string;
    profileLogoUrl?: string;
    profileContactEmail?: string;
}
export declare class UpdateBusinessProfileDto {
    name?: string;
    description?: string;
    logoUrl?: string;
    contactEmail?: string;
}
export declare class CreateLocationDto {
    name: string;
    address?: string;
    timezone: string;
}
export declare class UpdateLocationDto {
    name?: string;
    address?: string;
    timezone?: string;
}
export declare class CreateServiceCategoryDto {
    name: string;
    slug: string;
    parentCategoryId?: string;
}
export declare class CreateServiceDto {
    categoryId: string;
    name: string;
    slug: string;
    durationMinutes: number;
}
export declare class UpdateServiceDto {
    categoryId?: string;
    name?: string;
    slug?: string;
    durationMinutes?: number;
}
export declare class CreatePolicyDto {
    policyKey: string;
    policyValueJson: Record<string, unknown>;
}
export declare class UpdatePolicyDto {
    policyValueJson: Record<string, unknown>;
}
export declare const identifierValidation: RegExp;
