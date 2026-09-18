"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierPipe = void 0;
const common_1 = require("@nestjs/common");
const domain_error_1 = require("../../domain/shared/domain-error");
let IdentifierPipe = class IdentifierPipe {
    transform(value, metadata) {
        const pattern = metadata.data === 'policyKey' ? /^[a-z0-9]+(?:\.[a-z0-9]+)*$/ : /^[A-Za-z0-9_-]+$/;
        if (!pattern.test(value))
            throw new domain_error_1.ValidationError('Invalid route identifier.', 'VALIDATION_ERROR');
        return value;
    }
};
exports.IdentifierPipe = IdentifierPipe;
exports.IdentifierPipe = IdentifierPipe = __decorate([
    (0, common_1.Injectable)()
], IdentifierPipe);
