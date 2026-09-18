"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextLogger = void 0;
class RequestContextLogger {
    log(operation, context, entry) {
        const details = {
            correlationId: context.correlationId,
            organizationId: context.organizationId,
            businessId: context.businessId,
            actorId: context.actorId,
            operation,
            ...entry,
        };
        // This is intentionally a boundary hook; no provider secrets are logged.
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(details));
    }
}
exports.RequestContextLogger = RequestContextLogger;
