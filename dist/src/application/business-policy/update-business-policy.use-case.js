"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBusinessPolicyUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
const require_business_scope_1 = require("../shared/require-business-scope");
class UpdateBusinessPolicyUseCase {
    businessRepository;
    policyRepository;
    constructor(businessRepository, policyRepository) {
        this.businessRepository = businessRepository;
        this.policyRepository = policyRepository;
    }
    async execute(policyKey, policyValueJson, context) {
        await (0, require_business_scope_1.requireBusinessScope)(this.businessRepository, context);
        const current = await this.policyRepository.getCurrentByKey(policyKey, context);
        if (!current)
            throw new domain_error_1.ValidationError('Policy was not found.', 'POLICY_NOT_FOUND');
        return this.policyRepository.appendVersion({ businessId: context.businessId, policyKey, policyValueJson }, current.version, context);
    }
}
exports.UpdateBusinessPolicyUseCase = UpdateBusinessPolicyUseCase;
