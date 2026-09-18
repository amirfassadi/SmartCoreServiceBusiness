"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBusinessLocationUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
class AddBusinessLocationUseCase {
    businessRepository;
    businessLocationRepository;
    constructor(businessRepository, businessLocationRepository) {
        this.businessRepository = businessRepository;
        this.businessLocationRepository = businessLocationRepository;
    }
    async execute(input, context) {
        if (input.businessId !== context.businessId) {
            throw new domain_error_1.ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
        }
        if (!(await this.businessRepository.getById(context.businessId, context))) {
            throw new domain_error_1.ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
        }
        return this.businessLocationRepository.create(input, context);
    }
}
exports.AddBusinessLocationUseCase = AddBusinessLocationUseCase;
