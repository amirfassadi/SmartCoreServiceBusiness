"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const domain_error_1 = require("../../shared/domain-error");
const slug_value_object_1 = require("../../shared/slug.value-object");
const service_duration_value_object_1 = require("../value-objects/service-duration.value-object");
class Service {
    id;
    businessId;
    categoryId;
    name;
    slug;
    durationMinutes;
    active;
    createdAt;
    updatedAt;
    constructor(input) {
        this.id = input.id ?? `service-${Math.random().toString(36).slice(2, 11)}`;
        this.businessId = input.businessId;
        this.categoryId = input.categoryId;
        this.name = input.name.trim();
        if (!this.name)
            throw new domain_error_1.ValidationError('Service name is required.');
        this.slug = slug_value_object_1.Slug.create(input.slug).toString();
        this.durationMinutes = service_duration_value_object_1.ServiceDuration.create(input.durationMinutes).valueOf();
        this.active = input.active ?? true;
        this.createdAt = input.createdAt ?? new Date();
        this.updatedAt = input.updatedAt ?? this.createdAt;
    }
    static create(input) {
        return new Service(input);
    }
    archive() {
        this.active = false;
        this.updatedAt = new Date();
    }
}
exports.Service = Service;
