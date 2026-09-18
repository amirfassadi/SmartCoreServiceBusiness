"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpErrorFilter = void 0;
const common_1 = require("@nestjs/common");
const domain_error_1 = require("../../domain/shared/domain-error");
const statusByCode = {
    VALIDATION_ERROR: common_1.HttpStatus.BAD_REQUEST,
    INVALID_LOCALE: common_1.HttpStatus.BAD_REQUEST,
    INVALID_TIMEZONE: common_1.HttpStatus.BAD_REQUEST,
    INVALID_CURRENCY: common_1.HttpStatus.BAD_REQUEST,
    INVALID_SERVICE_DURATION: common_1.HttpStatus.BAD_REQUEST,
    INVALID_POLICY: common_1.HttpStatus.BAD_REQUEST,
    BUSINESS_ACCESS_DENIED: common_1.HttpStatus.FORBIDDEN,
    CROSS_BUSINESS_REFERENCE: common_1.HttpStatus.FORBIDDEN,
    BUSINESS_NOT_FOUND: common_1.HttpStatus.NOT_FOUND,
    PROFILE_NOT_FOUND: common_1.HttpStatus.NOT_FOUND,
    LOCATION_NOT_FOUND: common_1.HttpStatus.NOT_FOUND,
    CATEGORY_NOT_FOUND: common_1.HttpStatus.NOT_FOUND,
    SERVICE_NOT_FOUND: common_1.HttpStatus.NOT_FOUND,
    POLICY_NOT_FOUND: common_1.HttpStatus.NOT_FOUND,
    BUSINESS_SLUG_ALREADY_EXISTS: common_1.HttpStatus.CONFLICT,
    LOCATION_NAME_ALREADY_EXISTS: common_1.HttpStatus.CONFLICT,
    CATEGORY_SLUG_ALREADY_EXISTS: common_1.HttpStatus.CONFLICT,
    SERVICE_SLUG_ALREADY_EXISTS: common_1.HttpStatus.CONFLICT,
    POLICY_KEY_ALREADY_EXISTS: common_1.HttpStatus.CONFLICT,
    POLICY_VERSION_CONFLICT: common_1.HttpStatus.CONFLICT,
    INVALID_PARENT_CATEGORY: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
    INVALID_SERVICE_CATEGORY: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
};
let HttpErrorFilter = class HttpErrorFilter {
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        if (exception instanceof domain_error_1.DomainError) {
            const status = statusByCode[exception.code] ?? common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            response.status(status).json({ code: exception.code, message: exception.message, details: {} });
            return;
        }
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            response.status(status).json({ code: 'VALIDATION_ERROR', message: 'Request validation failed.', details: {} });
            return;
        }
        response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ code: 'PERSISTENCE_FAILURE', message: 'An internal error occurred.', details: {} });
    }
};
exports.HttpErrorFilter = HttpErrorFilter;
exports.HttpErrorFilter = HttpErrorFilter = __decorate([
    (0, common_1.Catch)()
], HttpErrorFilter);
