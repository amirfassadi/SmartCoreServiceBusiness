"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
class CreateServiceUseCase {
    businessRepository;
    serviceRepository;
    constructor(businessRepository, serviceRepository) {
        this.businessRepository = businessRepository;
        this.serviceRepository = serviceRepository;
    }
    async execute(input, context) {
        if (input.businessId !== context.businessId) {
            throw new domain_error_1.ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
        }
        if (!(await this.businessRepository.getById(context.businessId, context))) {
            throw new domain_error_1.ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
        }
        if (!(await this.serviceRepository.validateCategoryOwnership(input.categoryId, context))) {
            throw new domain_error_1.ValidationError('Invalid service category.', 'INVALID_SERVICE_CATEGORY');
        }
        if (await this.serviceRepository.getBySlug(input.slug, context)) {
            throw new domain_error_1.ValidationError('Service slug already exists.', 'SERVICE_SLUG_ALREADY_EXISTS');
        }
        return this.serviceRepository.create(input, context);
    }
}
exports.CreateServiceUseCase = CreateServiceUseCase;
