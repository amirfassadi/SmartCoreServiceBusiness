"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBusinessPolicyUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
class CreateBusinessPolicyUseCase {
    businessRepository;
    policyRepository;
    constructor(businessRepository, policyRepository) {
        this.businessRepository = businessRepository;
        this.policyRepository = policyRepository;
    }
    async execute(input, context) {
        if (input.businessId !== context.businessId) {
            throw new domain_error_1.ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
        }
        if (!(await this.businessRepository.getById(context.businessId, context))) {
            throw new domain_error_1.ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
        }
        const existing = await this.policyRepository.getCurrentByKey(input.policyKey, context);
        if (existing) {
            throw new domain_error_1.ValidationError('Policy key already exists.', 'POLICY_KEY_ALREADY_EXISTS');
        }
        return this.policyRepository.createVersion({
            businessId: input.businessId,
            policyKey: input.policyKey,
            policyValueJson: input.policyValueJson,
        }, context);
    }
}
exports.CreateBusinessPolicyUseCase = CreateBusinessPolicyUseCase;
