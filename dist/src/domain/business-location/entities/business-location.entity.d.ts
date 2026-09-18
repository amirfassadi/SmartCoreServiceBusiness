export interface BusinessLocationInput {
    businessId: string;
    name: string;
    address?: string;
    timezone: string;
    active?: boolean;
}
export declare class BusinessLocation {
    readonly id: string;
    readonly businessId: string;
    name: string;
    address?: string;
    timezone: string;
    active: boolean;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(input: {
        id?: string;
        businessId: string;
        name: string;
        address?: string;
        timezone: string;
        active?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    });
    static create(input: BusinessLocationInput): BusinessLocation;
    update(input: Partial<Pick<BusinessLocation, 'name' | 'address' | 'timezone'>>): void;
    deactivate(): void;
}
