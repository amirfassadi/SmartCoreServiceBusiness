"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePrismaRepository = void 0;
const service_entity_1 = require("../../../../domain/service/entities/service.entity");
const domain_error_1 = require("../../../../domain/shared/domain-error");
class ServicePrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(input, scope) {
        if (!(await this.validateCategoryOwnership(input.categoryId, scope)))
            throw new domain_error_1.DomainError('INVALID_SERVICE_CATEGORY', 'Service category is outside the business scope.');
        try {
            const record = await this.prisma.service.create({ data: { businessId: input.businessId, categoryId: input.categoryId, name: input.name, slug: input.slug, durationMinutes: input.durationMinutes, active: input.active ?? true } });
            return this.map(record);
        }
        catch (error) {
            if (this.isUniqueViolation(error))
                throw new domain_error_1.DomainError('SERVICE_SLUG_ALREADY_EXISTS', 'Service slug already exists.');
            throw error;
        }
    }
    async getById(id, scope) {
        const record = await this.prisma.service.findFirst({ where: { id, businessId: scope.businessId, business: { organizationId: scope.organizationId } } });
        return record ? this.map(record) : null;
    }
    async listByBusiness(scope) {
        const records = await this.prisma.service.findMany({ where: { businessId: scope.businessId, business: { organizationId: scope.organizationId } }, orderBy: { name: 'asc' } });
        return records.map((record) => this.map(record));
    }
    async update(id, input, scope) {
        if (input.categoryId && !(await this.validateCategoryOwnership(input.categoryId, scope)))
            throw new domain_error_1.DomainError('INVALID_SERVICE_CATEGORY', 'Service category is outside the business scope.');
        try {
            const record = await this.prisma.service.update({ where: { id, businessId: scope.businessId }, data: { categoryId: input.categoryId, name: input.name, slug: input.slug, durationMinutes: input.durationMinutes, active: input.active } });
            const scoped = await this.getById(record.id, scope);
            if (!scoped)
                throw new domain_error_1.DomainError('SERVICE_NOT_FOUND', 'Service was not found in the organization scope.');
            return scoped;
        }
        catch (error) {
            if (this.isUniqueViolation(error))
                throw new domain_error_1.DomainError('SERVICE_SLUG_ALREADY_EXISTS', 'Service slug already exists.');
            throw error;
        }
    }
    async archive(id, scope) {
        await this.ensureScoped(id, scope);
        const record = await this.prisma.service.update({ where: { id, businessId: scope.businessId }, data: { active: false, deletedAt: new Date() } });
        return this.map(record);
    }
    async validateCategoryOwnership(categoryId, scope) {
        return (await this.prisma.serviceCategory.findFirst({ where: { id: categoryId, businessId: scope.businessId, business: { organizationId: scope.organizationId } }, select: { id: true } })) !== null;
    }
    async getBySlug(slug, scope) {
        const record = await this.prisma.service.findFirst({ where: { slug, businessId: scope.businessId, business: { organizationId: scope.organizationId } } });
        return record ? this.map(record) : null;
    }
    async ensureScoped(id, scope) {
        if (!(await this.getById(id, scope)))
            throw new domain_error_1.DomainError('SERVICE_NOT_FOUND', 'Service was not found in the organization scope.');
    }
    map(record) {
        return new service_entity_1.Service(record);
    }
    isUniqueViolation(error) {
        return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
    }
}
exports.ServicePrismaRepository = ServicePrismaRepository;
