"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBusinessUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
class CreateBusinessUseCase {
    businessRepository;
    constructor(businessRepository) {
        this.businessRepository = businessRepository;
    }
    async execute(input, context) {
        const existing = await this.businessRepository.getBySlug(input.slug, context);
        if (existing) {
            throw new domain_error_1.ValidationError('Business slug already exists.', 'BUSINESS_SLUG_ALREADY_EXISTS');
        }
        return this.businessRepository.create(input, context);
    }
}
exports.CreateBusinessUseCase = CreateBusinessUseCase;
