"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessPolicyPrismaRepository = void 0;
const business_policy_entity_1 = require("../../../../domain/business-policy/entities/business-policy.entity");
const domain_error_1 = require("../../../../domain/shared/domain-error");
class BusinessPolicyPrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createVersion(input, scope) {
        await this.ensureBusiness(input.businessId, scope);
        const policyValueJson = this.requirePolicyValue(input.policyValueJson);
        try {
            const record = await this.prisma.$transaction(async (tx) => {
                const existing = await tx.businessPolicy.findFirst({ where: { businessId: input.businessId, policyKey: input.policyKey }, select: { id: true } });
                if (existing)
                    throw new domain_error_1.DomainError('POLICY_KEY_ALREADY_EXISTS', 'Policy key already exists.');
                return tx.businessPolicy.create({ data: { businessId: input.businessId, policyKey: input.policyKey, policyValueJson, version: 1 } });
            });
            return this.map(record);
        }
        catch (error) {
            if (this.isUniqueViolation(error))
                throw new domain_error_1.DomainError('POLICY_KEY_ALREADY_EXISTS', 'Policy key already exists.');
            throw error;
        }
    }
    async getCurrentByKey(policyKey, scope) {
        const record = await this.prisma.businessPolicy.findFirst({ where: { businessId: scope.businessId, policyKey, business: { organizationId: scope.organizationId } }, orderBy: { version: 'desc' } });
        return record ? this.map(record) : null;
    }
    async getVersions(policyKey, scope) {
        const records = await this.prisma.businessPolicy.findMany({ where: { businessId: scope.businessId, policyKey, business: { organizationId: scope.organizationId } }, orderBy: { version: 'asc' } });
        return records.map((record) => this.map(record));
    }
    async appendVersion(input, expectedVersion, scope) {
        await this.ensureBusiness(input.businessId, scope);
        const policyValueJson = this.requirePolicyValue(input.policyValueJson);
        try {
            const record = await this.prisma.$transaction(async (tx) => {
                const current = await tx.businessPolicy.findFirst({ where: { businessId: input.businessId, policyKey: input.policyKey }, orderBy: { version: 'desc' } });
                if (!current || current.version !== expectedVersion)
                    throw new domain_error_1.DomainError('POLICY_VERSION_CONFLICT', 'Policy version conflict.');
                return tx.businessPolicy.create({ data: { businessId: input.businessId, policyKey: input.policyKey, policyValueJson, version: expectedVersion + 1 } });
            });
            return this.map(record);
        }
        catch (error) {
            if (this.isUniqueViolation(error))
                throw new domain_error_1.DomainError('POLICY_VERSION_CONFLICT', 'Policy version conflict.');
            throw error;
        }
    }
    async ensureBusiness(businessId, scope) {
        if (businessId !== scope.businessId || !(await this.prisma.business.findFirst({ where: { id: businessId, organizationId: scope.organizationId }, select: { id: true } }))) {
            throw new domain_error_1.DomainError('BUSINESS_ACCESS_DENIED', 'Business is outside the organization scope.');
        }
    }
    map(record) {
        if (typeof record.policyValueJson !== 'object' || record.policyValueJson === null || Array.isArray(record.policyValueJson)) {
            throw new domain_error_1.DomainError('INVALID_POLICY', 'Policy value must be a JSON object.');
        }
        return new business_policy_entity_1.BusinessPolicy({ ...record, policyValueJson: record.policyValueJson });
    }
    requirePolicyValue(value) {
        if (value === null || Array.isArray(value))
            throw new domain_error_1.DomainError('INVALID_POLICY', 'Policy value must be a JSON object.');
        return JSON.parse(JSON.stringify(value));
    }
    isUniqueViolation(error) {
        return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
    }
}
exports.BusinessPolicyPrismaRepository = BusinessPolicyPrismaRepository;
