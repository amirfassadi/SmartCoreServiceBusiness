"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.DomainError = void 0;
class DomainError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = 'DomainError';
    }
}
exports.DomainError = DomainError;
class ValidationError extends DomainError {
    constructor(message, code = 'VALIDATION_ERROR') {
        super(code, message);
    }
}
exports.ValidationError = ValidationError;
