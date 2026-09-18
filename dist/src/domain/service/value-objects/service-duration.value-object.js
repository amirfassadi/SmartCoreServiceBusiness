"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceDuration = void 0;
const domain_error_1 = require("../../shared/domain-error");
class ServiceDuration {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new domain_error_1.ValidationError('Invalid service duration.');
        }
        return new ServiceDuration(value);
    }
    valueOf() {
        return this.value;
    }
    toString() {
        return `${this.value}`;
    }
}
exports.ServiceDuration = ServiceDuration;
