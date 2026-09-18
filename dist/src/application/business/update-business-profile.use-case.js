"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBusinessProfileUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
class UpdateBusinessProfileUseCase {
    businessRepository;
    constructor(businessRepository) {
        this.businessRepository = businessRepository;
    }
    async execute(id, input, context) {
        const business = await this.businessRepository.getById(id, context);
        if (!business) {
            throw new domain_error_1.ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
        }
        return this.businessRepository.updateProfile(id, input, context);
    }
}
exports.UpdateBusinessProfileUseCase = UpdateBusinessProfileUseCase;
