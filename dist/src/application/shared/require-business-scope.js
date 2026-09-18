"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireBusinessScope = requireBusinessScope;
const domain_error_1 = require("../../domain/shared/domain-error");
async function requireBusinessScope(businessRepository, context) {
    const business = await businessRepository.getById(context.businessId, context);
    if (!business) {
        throw new domain_error_1.ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
    }
}
