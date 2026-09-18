import { PrismaClient } from '@prisma/client';
import { BusinessLocation } from '../../../../domain/business-location/entities/business-location.entity';
import { BusinessLocationRepositoryPort, CreateBusinessLocationInput } from '../../../../domain/business-location/business-location.repository.port';
import { RepositoryScope } from '../../../../shared/context/request-context';
import { DomainError } from '../../../../domain/shared/domain-error';

export class BusinessLocationPrismaRepository implements BusinessLocationRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateBusinessLocationInput, scope: RepositoryScope): Promise<BusinessLocation> {
    const business = await this.prisma.business.findFirst({ where: { id: input.businessId, organizationId: scope.organizationId }, select: { id: true } });
    if (!business) throw new DomainError('BUSINESS_NOT_FOUND', 'Business was not found in the organization scope.');
    try {
      const record = await this.prisma.businessLocation.create({ data: { businessId: input.businessId, name: input.name, address: input.address, timezone: input.timezone, active: input.active ?? true } });
      return this.map(record);
    } catch (error) {
      if (this.isUniqueViolation(error)) throw new DomainError('LOCATION_NAME_ALREADY_EXISTS', 'Location name already exists.');
      throw error;
    }
  }

  async getById(id: string, scope: RepositoryScope & { businessId: string }): Promise<BusinessLocation | null> {
    const record = await this.prisma.businessLocation.findFirst({ where: { id, businessId: scope.businessId, business: { organizationId: scope.organizationId } } });
    return record ? this.map(record) : null;
  }

  async listByBusiness(scope: RepositoryScope & { businessId: string }): Promise<BusinessLocation[]> {
    const records = await this.prisma.businessLocation.findMany({ where: { businessId: scope.businessId, business: { organizationId: scope.organizationId } }, orderBy: { name: 'asc' } });
    return records.map((record: BusinessLocationRecord) => this.map(record));
  }

  async update(id: string, input: Partial<CreateBusinessLocationInput>, scope: RepositoryScope & { businessId: string }): Promise<BusinessLocation> {
    try {
      await this.ensureScoped(id, scope);
      const record = await this.prisma.businessLocation.update({ where: { id }, data: { name: input.name, address: input.address, timezone: input.timezone } });
      const scoped = await this.getById(record.id, scope);
      if (!scoped) throw new DomainError('LOCATION_NOT_FOUND', 'Location was not found in the organization scope.');
      return scoped;
    } catch (error) {
      if (this.isUniqueViolation(error)) throw new DomainError('LOCATION_NAME_ALREADY_EXISTS', 'Location name already exists.');
      throw error;
    }
  }

  async deactivate(id: string, scope: RepositoryScope & { businessId: string }): Promise<BusinessLocation> {
    await this.ensureScoped(id, scope);
    const record = await this.prisma.businessLocation.update({ where: { id, businessId: scope.businessId }, data: { active: false } });
    return this.map(record);
  }

  private async ensureScoped(id: string, scope: RepositoryScope & { businessId: string }): Promise<void> {
    if (!(await this.getById(id, scope))) throw new DomainError('LOCATION_NOT_FOUND', 'Location was not found in the organization scope.');
  }

  private map(record: { id: string; businessId: string; name: string; address: string | null; timezone: string; active: boolean; createdAt: Date; updatedAt: Date }): BusinessLocation {
    return new BusinessLocation({ ...record, address: record.address ?? undefined });
  }

  private isUniqueViolation(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
  }
}

type BusinessLocationRecord = {
  id: string;
  businessId: string;
  name: string;
  address: string | null;
  timezone: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};
