"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slug = void 0;
const domain_error_1 = require("./domain-error");
class Slug {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        const normalized = value.trim().toLowerCase();
        if (!normalized || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
            throw new domain_error_1.ValidationError('Invalid slug.');
        }
        return new Slug(normalized);
    }
    valueOf() {
        return this.value;
    }
    toString() {
        return this.value;
    }
}
exports.Slug = Slug;
