"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceCategoryUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
class CreateServiceCategoryUseCase {
    businessRepository;
    serviceCategoryRepository;
    constructor(businessRepository, serviceCategoryRepository) {
        this.businessRepository = businessRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
    }
    async execute(input, context) {
        if (input.businessId !== context.businessId) {
            throw new domain_error_1.ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
        }
        if (!(await this.businessRepository.getById(context.businessId, context))) {
            throw new domain_error_1.ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
        }
        const scope = context;
        const existing = await this.serviceCategoryRepository.getBySlug(input.slug, scope);
        if (existing) {
            throw new domain_error_1.ValidationError('Category slug already exists.', 'CATEGORY_SLUG_ALREADY_EXISTS');
        }
        if (input.parentCategoryId && !(await this.serviceCategoryRepository.validateParentOwnership(input.parentCategoryId, scope))) {
            throw new domain_error_1.ValidationError('Invalid parent category.', 'INVALID_PARENT_CATEGORY');
        }
        return this.serviceCategoryRepository.create(input, scope);
    }
}
exports.CreateServiceCategoryUseCase = CreateServiceCategoryUseCase;
