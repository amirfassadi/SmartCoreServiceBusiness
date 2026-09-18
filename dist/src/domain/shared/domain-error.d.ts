export declare class DomainError extends Error {
    readonly code: string;
    constructor(code: string, message: string);
}
export declare class ValidationError extends DomainError {
    constructor(message: string, code?: string);
}
