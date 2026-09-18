"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessPolicy = void 0;
const domain_error_1 = require("../../shared/domain-error");
class BusinessPolicy {
    id;
    businessId;
    policyKey;
    policyValueJson;
    version;
    createdAt;
    updatedAt;
    constructor(input) {
        this.id = input.id ?? `policy-${Math.random().toString(36).slice(2, 11)}`;
        this.businessId = input.businessId;
        this.policyKey = input.policyKey.trim();
        if (!this.policyKey || !/^[a-z0-9]+(?:\.[a-z0-9]+)*$/.test(this.policyKey)) {
            throw new domain_error_1.ValidationError('Invalid policy key.');
        }
        this.policyValueJson = input.policyValueJson;
        if (this.policyValueJson === null) {
            throw new domain_error_1.ValidationError('Policy value JSON is required.');
        }
        if (!this.isValidJsonShape(this.policyValueJson)) {
            throw new domain_error_1.ValidationError('Policy value must be valid JSON object content.');
        }
        this.version = input.version;
        if (this.version < 1)
            throw new domain_error_1.ValidationError('Policy version must be >= 1.');
        this.createdAt = input.createdAt ?? new Date();
        this.updatedAt = input.updatedAt ?? this.createdAt;
    }
    isValidJsonShape(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
    static create(input) {
        return new BusinessPolicy({
            businessId: input.businessId,
            policyKey: input.policyKey,
            policyValueJson: input.policyValueJson,
            version: input.version ?? 1,
        });
    }
    createNextVersion(newValue) {
        if (!this.isValidJsonShape(newValue)) {
            throw new domain_error_1.ValidationError('Policy value must be valid JSON object content.');
        }
        return new BusinessPolicy({
            businessId: this.businessId,
            policyKey: this.policyKey,
            policyValueJson: newValue,
            version: this.version + 1,
        });
    }
}
exports.BusinessPolicy = BusinessPolicy;
