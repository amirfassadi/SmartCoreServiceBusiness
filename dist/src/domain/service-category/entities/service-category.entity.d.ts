export interface ServiceCategoryInput {
    businessId: string;
    name: string;
    slug: string;
    parentCategoryId?: string;
    active?: boolean;
}
export declare class ServiceCategory {
    readonly id: string;
    readonly businessId: string;
    name: string;
    slug: string;
    parentCategoryId?: string;
    active: boolean;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(input: {
        id?: string;
        businessId: string;
        name: string;
        slug: string;
        parentCategoryId?: string;
        active?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    });
    static create(input: ServiceCategoryInput): ServiceCategory;
    setParent(parentCategoryId: string): void;
}
