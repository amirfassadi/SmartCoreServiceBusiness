export interface BusinessPolicyInput {
    businessId: string;
    policyKey: string;
    policyValueJson: Record<string, unknown> | null;
    version?: number;
}
export declare class BusinessPolicy {
    readonly id: string;
    readonly businessId: string;
    readonly policyKey: string;
    policyValueJson: Record<string, unknown> | null;
    readonly version: number;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(input: {
        id?: string;
        businessId: string;
        policyKey: string;
        policyValueJson: Record<string, unknown> | null;
        version: number;
        createdAt?: Date;
        updatedAt?: Date;
    });
    private isValidJsonShape;
    static create(input: BusinessPolicyInput): BusinessPolicy;
    createNextVersion(newValue: Record<string, unknown>): BusinessPolicy;
}
