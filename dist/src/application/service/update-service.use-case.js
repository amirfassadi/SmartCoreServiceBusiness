"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServiceUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
const require_business_scope_1 = require("../shared/require-business-scope");
class UpdateServiceUseCase {
    businessRepository;
    serviceRepository;
    constructor(businessRepository, serviceRepository) {
        this.businessRepository = businessRepository;
        this.serviceRepository = serviceRepository;
    }
    async execute(serviceId, input, context) {
        await (0, require_business_scope_1.requireBusinessScope)(this.businessRepository, context);
        const service = await this.serviceRepository.getById(serviceId, context);
        if (!service)
            throw new domain_error_1.ValidationError('Service was not found.', 'SERVICE_NOT_FOUND');
        if (input.categoryId && !(await this.serviceRepository.validateCategoryOwnership(input.categoryId, context))) {
            throw new domain_error_1.ValidationError('Invalid service category.', 'INVALID_SERVICE_CATEGORY');
        }
        if (input.slug && input.slug !== service.slug && await this.serviceRepository.getBySlug(input.slug, context)) {
            throw new domain_error_1.ValidationError('Service slug already exists.', 'SERVICE_SLUG_ALREADY_EXISTS');
        }
        return this.serviceRepository.update(serviceId, input, context);
    }
}
exports.UpdateServiceUseCase = UpdateServiceUseCase;
