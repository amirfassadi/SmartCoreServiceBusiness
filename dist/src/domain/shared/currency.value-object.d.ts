export declare class Currency {
    private readonly value;
    private constructor();
    static create(value: string): Currency;
    valueOf(): string;
    toString(): string;
}
