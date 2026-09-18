"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Locale = void 0;
const domain_error_1 = require("./domain-error");
class Locale {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        const normalized = value.trim();
        const pattern = /^[a-z]{2,3}(-[A-Z0-9]{2,8})?$/;
        if (!pattern.test(normalized)) {
            throw new domain_error_1.ValidationError('Invalid locale.');
        }
        return new Locale(normalized);
    }
    static isValid(value) {
        try {
            Locale.create(value);
            return true;
        }
        catch {
            return false;
        }
    }
    valueOf() {
        return this.value;
    }
    toString() {
        return this.value;
    }
}
exports.Locale = Locale;
