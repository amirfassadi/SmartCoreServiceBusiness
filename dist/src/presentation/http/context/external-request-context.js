"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderExternalRequestContextAdapter = void 0;
const domain_error_1 = require("../../../domain/shared/domain-error");
class HeaderExternalRequestContextAdapter {
    getValidatedContext(request, businessId) {
        if (!request?.organizationId) {
            throw new domain_error_1.ValidationError('Validated organization context is required.', 'BUSINESS_ACCESS_DENIED');
        }
        return { organizationId: request.organizationId, actorId: request.actorId, businessId };
    }
}
exports.HeaderExternalRequestContextAdapter = HeaderExternalRequestContextAdapter;
