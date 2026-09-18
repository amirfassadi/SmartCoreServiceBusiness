"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBusinessUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
class GetBusinessUseCase {
    businessRepository;
    constructor(businessRepository) {
        this.businessRepository = businessRepository;
    }
    async execute(id, context) {
        const business = await this.businessRepository.getById(id, context);
        if (!business) {
            throw new domain_error_1.ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
        }
        return { id: business.id, slug: business.slug, organizationId: business.organizationId };
    }
}
exports.GetBusinessUseCase = GetBusinessUseCase;
