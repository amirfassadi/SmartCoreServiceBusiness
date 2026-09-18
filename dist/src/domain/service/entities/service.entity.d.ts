export interface ServiceInput {
    businessId: string;
    categoryId: string;
    name: string;
    slug: string;
    durationMinutes: number;
    active?: boolean;
}
export declare class Service {
    readonly id: string;
    readonly businessId: string;
    readonly categoryId: string;
    name: string;
    slug: string;
    durationMinutes: number;
    active: boolean;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(input: {
        id?: string;
        businessId: string;
        categoryId: string;
        name: string;
        slug: string;
        durationMinutes: number;
        active?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    });
    static create(input: ServiceInput): Service;
    archive(): void;
}
