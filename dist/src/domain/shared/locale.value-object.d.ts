export declare class Locale {
    private readonly value;
    private constructor();
    static create(value: string): Locale;
    static isValid(value: string): boolean;
    valueOf(): string;
    toString(): string;
}
