"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBusinessPolicyVersionsUseCase = void 0;
const require_business_scope_1 = require("../shared/require-business-scope");
class GetBusinessPolicyVersionsUseCase {
    businessRepository;
    policyRepository;
    constructor(businessRepository, policyRepository) {
        this.businessRepository = businessRepository;
        this.policyRepository = policyRepository;
    }
    async execute(policyKey, context) {
        await (0, require_business_scope_1.requireBusinessScope)(this.businessRepository, context);
        return this.policyRepository.getVersions(policyKey, context);
    }
}
exports.GetBusinessPolicyVersionsUseCase = GetBusinessPolicyVersionsUseCase;
