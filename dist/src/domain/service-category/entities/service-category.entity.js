"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCategory = void 0;
const domain_error_1 = require("../../shared/domain-error");
const slug_value_object_1 = require("../../shared/slug.value-object");
class ServiceCategory {
    id;
    businessId;
    name;
    slug;
    parentCategoryId;
    active;
    createdAt;
    updatedAt;
    constructor(input) {
        this.id = input.id ?? `category-${Math.random().toString(36).slice(2, 11)}`;
        this.businessId = input.businessId;
        this.name = input.name.trim();
        if (!this.name)
            throw new domain_error_1.ValidationError('Category name is required.');
        this.slug = slug_value_object_1.Slug.create(input.slug).toString();
        this.parentCategoryId = input.parentCategoryId;
        if (this.parentCategoryId && this.parentCategoryId === this.id) {
            throw new domain_error_1.ValidationError('Category cannot be its own parent.');
        }
        this.active = input.active ?? true;
        this.createdAt = input.createdAt ?? new Date();
        this.updatedAt = input.updatedAt ?? this.createdAt;
    }
    static create(input) {
        return new ServiceCategory(input);
    }
    setParent(parentCategoryId) {
        if (parentCategoryId === this.id) {
            throw new domain_error_1.ValidationError('Category cannot be its own parent.');
        }
        this.parentCategoryId = parentCategoryId;
        this.updatedAt = new Date();
    }
}
exports.ServiceCategory = ServiceCategory;
