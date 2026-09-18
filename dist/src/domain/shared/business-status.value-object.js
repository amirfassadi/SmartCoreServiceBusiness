"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessStatus = void 0;
const domain_error_1 = require("./domain-error");
class BusinessStatus {
    value;
    constructor(value) {
        this.value = value;
    }
    static values() {
        return ['draft', 'active', 'suspended', 'archived'];
    }
    static draft() {
        return new BusinessStatus('draft');
    }
    static create(value) {
        const normalized = value.trim().toLowerCase();
        if (!BusinessStatus.values().includes(normalized)) {
            throw new domain_error_1.ValidationError('Invalid business status.');
        }
        return new BusinessStatus(normalized);
    }
    static active() {
        return new BusinessStatus('active');
    }
    static suspended() {
        return new BusinessStatus('suspended');
    }
    static archived() {
        return new BusinessStatus('archived');
    }
    valueOf() {
        return this.value;
    }
    toString() {
        return this.value;
    }
    equals(other) {
        return this.value === other.valueOf();
    }
}
exports.BusinessStatus = BusinessStatus;
