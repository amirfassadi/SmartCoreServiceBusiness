"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCategoryPrismaRepository = void 0;
const service_category_entity_1 = require("../../../../domain/service-category/entities/service-category.entity");
const domain_error_1 = require("../../../../domain/shared/domain-error");
class ServiceCategoryPrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(input, scope) {
        const business = await this.prisma.business.findFirst({ where: { id: input.businessId, organizationId: scope.organizationId }, select: { id: true } });
        if (!business)
            throw new domain_error_1.DomainError('BUSINESS_NOT_FOUND', 'Business was not found in the organization scope.');
        if (input.parentCategoryId && !(await this.validateParentOwnership(input.parentCategoryId, scope))) {
            throw new domain_error_1.DomainError('INVALID_PARENT_CATEGORY', 'Parent category is outside the business scope.');
        }
        try {
            const record = await this.prisma.serviceCategory.create({ data: { businessId: input.businessId, name: input.name, slug: input.slug, parentCategoryId: input.parentCategoryId ?? null, active: input.active ?? true } });
            return this.map(record);
        }
        catch (error) {
            if (this.isUniqueViolation(error))
                throw new domain_error_1.DomainError('CATEGORY_SLUG_ALREADY_EXISTS', 'Category slug already exists.');
            throw error;
        }
    }
    async getById(id, scope) {
        const record = await this.prisma.serviceCategory.findFirst({ where: { id, businessId: scope.businessId, business: { organizationId: scope.organizationId } } });
        return record ? this.map(record) : null;
    }
    async listByBusiness(scope) {
        const records = await this.prisma.serviceCategory.findMany({ where: { businessId: scope.businessId, business: { organizationId: scope.organizationId } }, orderBy: { name: 'asc' } });
        return records.map((record) => this.map(record));
    }
    async getBySlug(slug, scope) {
        const record = await this.prisma.serviceCategory.findFirst({ where: { slug, businessId: scope.businessId, business: { organizationId: scope.organizationId } } });
        return record ? this.map(record) : null;
    }
    async validateParentOwnership(parentCategoryId, scope) {
        return (await this.prisma.serviceCategory.findFirst({ where: { id: parentCategoryId, businessId: scope.businessId, business: { organizationId: scope.organizationId } }, select: { id: true } })) !== null;
    }
    map(record) {
        return new service_category_entity_1.ServiceCategory({ ...record, parentCategoryId: record.parentCategoryId ?? undefined });
    }
    isUniqueViolation(error) {
        return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
    }
}
exports.ServiceCategoryPrismaRepository = ServiceCategoryPrismaRepository;
