"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timezone = void 0;
const domain_error_1 = require("./domain-error");
class Timezone {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        const normalized = value.trim();
        if (!normalized || !/^[A-Za-z_]+\/[A-Za-z0-9_\-+]+$/.test(normalized) && !/^[A-Za-z_]+$/.test(normalized)) {
            throw new domain_error_1.ValidationError('Invalid timezone.');
        }
        return new Timezone(normalized);
    }
    valueOf() {
        return this.value;
    }
    toString() {
        return this.value;
    }
}
exports.Timezone = Timezone;
