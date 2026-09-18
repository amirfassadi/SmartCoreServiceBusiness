"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = void 0;
const domain_error_1 = require("./domain-error");
class Currency {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        const normalized = value.trim().toUpperCase();
        if (!/^[A-Z]{3}$/.test(normalized)) {
            throw new domain_error_1.ValidationError('Invalid currency.');
        }
        return new Currency(normalized);
    }
    valueOf() {
        return this.value;
    }
    toString() {
        return this.value;
    }
}
exports.Currency = Currency;
