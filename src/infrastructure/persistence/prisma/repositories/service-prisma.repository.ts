import { PrismaClient } from '@prisma/client';
import { Service } from '../../../../domain/service/entities/service.entity';
import { CreateServiceInput, ServiceRepositoryPort } from '../../../../domain/service/service.repository.port';
import { RepositoryScope } from '../../../../shared/context/request-context';
import { DomainError } from '../../../../domain/shared/domain-error';

export class ServicePrismaRepository implements ServiceRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateServiceInput, scope: RepositoryScope & { businessId: string }): Promise<Service> {
    if (input.businessId !== scope.businessId) {
      throw new DomainError('BUSINESS_ACCESS_DENIED', 'Business is outside the request scope.');
    }
    if (!(await this.validateCategoryOwnership(input.categoryId, scope))) throw new DomainError('INVALID_SERVICE_CATEGORY', 'Service category is outside the business scope.');
    try {
      const record = await this.prisma.service.create({ data: { businessId: input.businessId, categoryId: input.categoryId, name: input.name, slug: input.slug, durationMinutes: input.durationMinutes, active: input.active ?? true } });
      return this.map(record);
    } catch (error) {
      if (this.isUniqueViolation(error)) throw new DomainError('SERVICE_SLUG_ALREADY_EXISTS', 'Service slug already exists.');
      throw error;
    }
  }

  async getById(id: string, scope: RepositoryScope & { businessId: string }): Promise<Service | null> {
    const record = await this.prisma.service.findFirst({ where: { id, businessId: scope.businessId, business: { organizationId: scope.organizationId } } });
    return record ? this.map(record) : null;
  }

  async listByBusiness(scope: RepositoryScope & { businessId: string }): Promise<Service[]> {
    const records = await this.prisma.service.findMany({ where: { businessId: scope.businessId, business: { organizationId: scope.organizationId } }, orderBy: { name: 'asc' } });
    return records.map((record) => this.map(record));
  }

  async update(id: string, input: Partial<CreateServiceInput>, scope: RepositoryScope & { businessId: string }): Promise<Service> {
    if (input.categoryId && !(await this.validateCategoryOwnership(input.categoryId, scope))) throw new DomainError('INVALID_SERVICE_CATEGORY', 'Service category is outside the business scope.');
    try {
      await this.ensureScoped(id, scope);
      if (input.businessId !== undefined && input.businessId !== scope.businessId) {
        throw new DomainError('BUSINESS_ACCESS_DENIED', 'Business is outside the request scope.');
      }
      const record = await this.prisma.service.update({ where: { id }, data: { categoryId: input.categoryId, name: input.name, slug: input.slug, durationMinutes: input.durationMinutes, active: input.active } });
      const scoped = await this.getById(record.id, scope);
      if (!scoped) throw new DomainError('SERVICE_NOT_FOUND', 'Service was not found in the organization scope.');
      return scoped;
    } catch (error) {
      if (this.isUniqueViolation(error)) throw new DomainError('SERVICE_SLUG_ALREADY_EXISTS', 'Service slug already exists.');
      throw error;
    }
  }

  async archive(id: string, scope: RepositoryScope & { businessId: string }): Promise<Service> {
    await this.ensureScoped(id, scope);
    const record = await this.prisma.service.update({ where: { id, businessId: scope.businessId }, data: { active: false, deletedAt: new Date() } });
    return this.map(record);
  }

  async validateCategoryOwnership(categoryId: string, scope: RepositoryScope & { businessId: string }): Promise<boolean> {
    return (await this.prisma.serviceCategory.findFirst({ where: { id: categoryId, businessId: scope.businessId, business: { organizationId: scope.organizationId } }, select: { id: true } })) !== null;
  }

  async getBySlug(slug: string, scope: RepositoryScope & { businessId: string }): Promise<Service | null> {
    const record = await this.prisma.service.findFirst({ where: { slug, businessId: scope.businessId, business: { organizationId: scope.organizationId } } });
    return record ? this.map(record) : null;
  }

  private async ensureScoped(id: string, scope: RepositoryScope & { businessId: string }): Promise<void> {
    if (!(await this.getById(id, scope))) throw new DomainError('SERVICE_NOT_FOUND', 'Service was not found in the organization scope.');
  }

  private map(record: { id: string; businessId: string; categoryId: string; name: string; slug: string; durationMinutes: number; active: boolean; createdAt: Date; updatedAt: Date }): Service {
    return new Service(record);
  }

  private isUniqueViolation(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
  }
}
