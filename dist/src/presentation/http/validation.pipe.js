"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phase1ValidationPipe = void 0;
const common_1 = require("@nestjs/common");
exports.phase1ValidationPipe = new common_1.ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => new common_1.BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed.',
        details: errors.map((error) => ({ property: error.property, constraints: error.constraints })),
    }),
});
