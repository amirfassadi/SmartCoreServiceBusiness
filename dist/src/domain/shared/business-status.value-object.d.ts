export type BusinessStatusValue = 'draft' | 'active' | 'suspended' | 'archived';
export declare class BusinessStatus {
    private readonly value;
    private constructor();
    static values(): BusinessStatusValue[];
    static draft(): BusinessStatus;
    static create(value: string): BusinessStatus;
    static active(): BusinessStatus;
    static suspended(): BusinessStatus;
    static archived(): BusinessStatus;
    valueOf(): BusinessStatusValue;
    toString(): string;
    equals(other: BusinessStatus): boolean;
}
