"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCurrentBusinessPolicyUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
const require_business_scope_1 = require("../shared/require-business-scope");
class GetCurrentBusinessPolicyUseCase {
    businessRepository;
    policyRepository;
    constructor(businessRepository, policyRepository) {
        this.businessRepository = businessRepository;
        this.policyRepository = policyRepository;
    }
    async execute(policyKey, context) {
        await (0, require_business_scope_1.requireBusinessScope)(this.businessRepository, context);
        const policy = await this.policyRepository.getCurrentByKey(policyKey, context);
        if (!policy)
            throw new domain_error_1.ValidationError('Policy was not found.', 'POLICY_NOT_FOUND');
        return policy;
    }
}
exports.GetCurrentBusinessPolicyUseCase = GetCurrentBusinessPolicyUseCase;
