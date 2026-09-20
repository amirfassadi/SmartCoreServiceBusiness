import { PrismaClient } from '@prisma/client';
import { ServiceCategory } from '../../../../domain/service-category/entities/service-category.entity';
import { CategoryLifecycleStatus, CreateServiceCategoryInput, ServiceCategoryRepositoryPort } from '../../../../domain/service-category/service-category.repository.port';
import { RepositoryScope } from '../../../../shared/context/request-context';
import { DomainError } from '../../../../domain/shared/domain-error';

export class ServiceCategoryPrismaRepository implements ServiceCategoryRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateServiceCategoryInput, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory> {
    if (input.businessId !== scope.businessId) {
      throw new DomainError('BUSINESS_ACCESS_DENIED', 'Business is outside the request scope.');
    }
    const business = await this.prisma.business.findFirst({ where: { id: input.businessId, organizationId: scope.organizationId }, select: { id: true } });
    if (!business) throw new DomainError('BUSINESS_NOT_FOUND', 'Business was not found in the organization scope.');
    if (input.parentCategoryId && !(await this.validateParentOwnership(input.parentCategoryId, scope))) {
      throw new DomainError('INVALID_PARENT_CATEGORY', 'Parent category is outside the business scope.');
    }
    try {
      const record = await this.prisma.serviceCategory.create({ data: { businessId: input.businessId, name: input.name, slug: input.slug, parentCategoryId: input.parentCategoryId ?? null } });
      return this.map(record);
    } catch (error) {
      if (this.isUniqueViolation(error)) throw new DomainError('CATEGORY_SLUG_ALREADY_EXISTS', 'Category slug already exists.');
      throw error;
    }
  }

  async getById(id: string, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory | null> {
    const record = await this.prisma.serviceCategory.findFirst({ where: { id, businessId: scope.businessId, business: { organizationId: scope.organizationId } } });
    return record ? this.map(record) : null;
  }

  async listByBusiness(status: CategoryLifecycleStatus, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory[]> {
    const records = await this.prisma.serviceCategory.findMany({ where: { businessId: scope.businessId, business: { organizationId: scope.organizationId }, ...this.lifecycleWhere(status) }, orderBy: { name: 'asc' } });
    return records.map((record) => this.map(record));
  }

  async getBySlug(slug: string, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory | null> {
    const record = await this.prisma.serviceCategory.findFirst({ where: { slug, businessId: scope.businessId, business: { organizationId: scope.organizationId } } });
    return record ? this.map(record) : null;
  }

  async validateParentOwnership(parentCategoryId: string, scope: RepositoryScope & { businessId: string }): Promise<boolean> {
    return (await this.prisma.serviceCategory.findFirst({ where: { id: parentCategoryId, businessId: scope.businessId, business: { organizationId: scope.organizationId } }, select: { id: true } })) !== null;
  }

  async update(id: string, input: Partial<CreateServiceCategoryInput>, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory> {
    const current = await this.getById(id, scope);
    if (!current) throw new DomainError('CATEGORY_NOT_FOUND', 'Category was not found in the organization scope.');
    if (current.archivedAt) throw new DomainError('CATEGORY_ARCHIVED', 'Archived categories cannot be updated.');
    if (input.parentCategoryId === id) throw new DomainError('INVALID_PARENT_CATEGORY', 'Category cannot be its own parent.');
    if (input.parentCategoryId && !(await this.validateParentOwnership(input.parentCategoryId, scope))) throw new DomainError('INVALID_PARENT_CATEGORY', 'Parent category is outside the business scope.');
    try {
      const record = await this.prisma.serviceCategory.update({ where: { id }, data: { name: input.name, slug: input.slug, parentCategoryId: input.parentCategoryId } });
      return this.map(record);
    } catch (error) {
      if (this.isUniqueViolation(error)) throw new DomainError('CATEGORY_SLUG_ALREADY_EXISTS', 'Category slug already exists.');
      throw error;
    }
  }

  async archive(id: string, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory> {
    const current = await this.getById(id, scope);
    if (!current) throw new DomainError('CATEGORY_NOT_FOUND', 'Category was not found in the organization scope.');
    if (current.archivedAt) return current;
    if (await this.hasActiveServices(id, scope)) throw new DomainError('CATEGORY_HAS_ACTIVE_SERVICES', 'Category contains active services.');
    return this.map(await this.prisma.serviceCategory.update({ where: { id }, data: { archivedAt: new Date() } }));
  }

  async restore(id: string, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory> {
    const current = await this.getById(id, scope);
    if (!current) throw new DomainError('CATEGORY_NOT_FOUND', 'Category was not found in the organization scope.');
    if (!current.archivedAt) return current;
    return this.map(await this.prisma.serviceCategory.update({ where: { id }, data: { archivedAt: null } }));
  }

  async hasActiveServices(id: string, scope: RepositoryScope & { businessId: string }): Promise<boolean> {
    return (await this.prisma.service.count({ where: { categoryId: id, businessId: scope.businessId, archivedAt: null, business: { organizationId: scope.organizationId } } })) > 0;
  }

  private map(record: { id: string; businessId: string; name: string; slug: string; parentCategoryId: string | null; archivedAt: Date | null; createdAt: Date; updatedAt: Date }): ServiceCategory {
    return new ServiceCategory({ ...record, parentCategoryId: record.parentCategoryId ?? undefined });
  }

  private lifecycleWhere(status: CategoryLifecycleStatus): { archivedAt?: Date | null | { not: null } } {
    if (status === 'archived') return { archivedAt: { not: null } };
    if (status === 'all') return {};
    return { archivedAt: null };
  }

  private isUniqueViolation(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
  }
}
