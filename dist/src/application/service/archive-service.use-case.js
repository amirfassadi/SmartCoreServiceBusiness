"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveServiceUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
const require_business_scope_1 = require("../shared/require-business-scope");
class ArchiveServiceUseCase {
    businessRepository;
    serviceRepository;
    constructor(businessRepository, serviceRepository) {
        this.businessRepository = businessRepository;
        this.serviceRepository = serviceRepository;
    }
    async execute(serviceId, context) {
        await (0, require_business_scope_1.requireBusinessScope)(this.businessRepository, context);
        const service = await this.serviceRepository.getById(serviceId, context);
        if (!service)
            throw new domain_error_1.ValidationError('Service was not found.', 'SERVICE_NOT_FOUND');
        return this.serviceRepository.archive(serviceId, context);
    }
}
exports.ArchiveServiceUseCase = ArchiveServiceUseCase;
