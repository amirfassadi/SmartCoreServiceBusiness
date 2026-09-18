"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessLocationPrismaRepository = void 0;
const business_location_entity_1 = require("../../../../domain/business-location/entities/business-location.entity");
const domain_error_1 = require("../../../../domain/shared/domain-error");
class BusinessLocationPrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(input, scope) {
        const business = await this.prisma.business.findFirst({ where: { id: input.businessId, organizationId: scope.organizationId }, select: { id: true } });
        if (!business)
            throw new domain_error_1.DomainError('BUSINESS_NOT_FOUND', 'Business was not found in the organization scope.');
        try {
            const record = await this.prisma.businessLocation.create({ data: { businessId: input.businessId, name: input.name, address: input.address, timezone: input.timezone, active: input.active ?? true } });
            return this.map(record);
        }
        catch (error) {
            if (this.isUniqueViolation(error))
                throw new domain_error_1.DomainError('LOCATION_NAME_ALREADY_EXISTS', 'Location name already exists.');
            throw error;
        }
    }
    async getById(id, scope) {
        const record = await this.prisma.businessLocation.findFirst({ where: { id, businessId: scope.businessId, business: { organizationId: scope.organizationId } } });
        return record ? this.map(record) : null;
    }
    async listByBusiness(scope) {
        const records = await this.prisma.businessLocation.findMany({ where: { businessId: scope.businessId, business: { organizationId: scope.organizationId } }, orderBy: { name: 'asc' } });
        return records.map((record) => this.map(record));
    }
    async update(id, input, scope) {
        try {
            const record = await this.prisma.businessLocation.update({ where: { id, businessId: scope.businessId }, data: { name: input.name, address: input.address, timezone: input.timezone } });
            const scoped = await this.getById(record.id, scope);
            if (!scoped)
                throw new domain_error_1.DomainError('LOCATION_NOT_FOUND', 'Location was not found in the organization scope.');
            return scoped;
        }
        catch (error) {
            if (this.isUniqueViolation(error))
                throw new domain_error_1.DomainError('LOCATION_NAME_ALREADY_EXISTS', 'Location name already exists.');
            throw error;
        }
    }
    async deactivate(id, scope) {
        await this.ensureScoped(id, scope);
        const record = await this.prisma.businessLocation.update({ where: { id, businessId: scope.businessId }, data: { active: false } });
        return this.map(record);
    }
    async ensureScoped(id, scope) {
        if (!(await this.getById(id, scope)))
            throw new domain_error_1.DomainError('LOCATION_NOT_FOUND', 'Location was not found in the organization scope.');
    }
    map(record) {
        return new business_location_entity_1.BusinessLocation({ ...record, address: record.address ?? undefined });
    }
    isUniqueViolation(error) {
        return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
    }
}
exports.BusinessLocationPrismaRepository = BusinessLocationPrismaRepository;
