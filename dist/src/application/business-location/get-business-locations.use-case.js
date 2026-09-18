"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBusinessLocationsUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
class GetBusinessLocationsUseCase {
    businessLocationRepository;
    constructor(businessLocationRepository) {
        this.businessLocationRepository = businessLocationRepository;
    }
    async execute(businessId, context) {
        if (businessId !== context.businessId) {
            throw new domain_error_1.ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
        }
        return this.businessLocationRepository.listByBusiness(context);
    }
}
exports.GetBusinessLocationsUseCase = GetBusinessLocationsUseCase;
