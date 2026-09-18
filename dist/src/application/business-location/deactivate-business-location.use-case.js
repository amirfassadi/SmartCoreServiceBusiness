"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateBusinessLocationUseCase = void 0;
const domain_error_1 = require("../../domain/shared/domain-error");
const require_business_scope_1 = require("../shared/require-business-scope");
class DeactivateBusinessLocationUseCase {
    businessRepository;
    locationRepository;
    constructor(businessRepository, locationRepository) {
        this.businessRepository = businessRepository;
        this.locationRepository = locationRepository;
    }
    async execute(locationId, context) {
        await (0, require_business_scope_1.requireBusinessScope)(this.businessRepository, context);
        const location = await this.locationRepository.getById(locationId, context);
        if (!location)
            throw new domain_error_1.ValidationError('Location was not found.', 'LOCATION_NOT_FOUND');
        return this.locationRepository.deactivate(locationId, context);
    }
}
exports.DeactivateBusinessLocationUseCase = DeactivateBusinessLocationUseCase;
