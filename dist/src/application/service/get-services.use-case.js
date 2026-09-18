"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServicesUseCase = void 0;
const require_business_scope_1 = require("../shared/require-business-scope");
class GetServicesUseCase {
    businessRepository;
    serviceRepository;
    constructor(businessRepository, serviceRepository) {
        this.businessRepository = businessRepository;
        this.serviceRepository = serviceRepository;
    }
    async execute(context) {
        await (0, require_business_scope_1.requireBusinessScope)(this.businessRepository, context);
        return this.serviceRepository.listByBusiness(context);
    }
}
exports.GetServicesUseCase = GetServicesUseCase;
