"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessLocation = void 0;
const domain_error_1 = require("../../shared/domain-error");
const timezone_value_object_1 = require("../../shared/timezone.value-object");
class BusinessLocation {
    id;
    businessId;
    name;
    address;
    timezone;
    active;
    createdAt;
    updatedAt;
    constructor(input) {
        this.id = input.id ?? `location-${Math.random().toString(36).slice(2, 11)}`;
        this.businessId = input.businessId;
        this.name = input.name.trim();
        if (!this.name)
            throw new domain_error_1.ValidationError('Location name is required.');
        this.address = input.address;
        this.timezone = timezone_value_object_1.Timezone.create(input.timezone).toString();
        this.active = input.active ?? true;
        this.createdAt = input.createdAt ?? new Date();
        this.updatedAt = input.updatedAt ?? this.createdAt;
    }
    static create(input) {
        return new BusinessLocation(input);
    }
    update(input) {
        if (input.name !== undefined)
            this.name = input.name.trim();
        if (input.address !== undefined)
            this.address = input.address;
        if (input.timezone !== undefined)
            this.timezone = timezone_value_object_1.Timezone.create(input.timezone).toString();
        this.updatedAt = new Date();
    }
    deactivate() {
        this.active = false;
        this.updatedAt = new Date();
    }
}
exports.BusinessLocation = BusinessLocation;
