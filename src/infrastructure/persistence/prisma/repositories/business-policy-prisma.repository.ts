import { PrismaClient } from '@prisma/client';
import { BusinessPolicy } from '../../../../domain/business-policy/entities/business-policy.entity';
import { BusinessPolicyRecord, BusinessPolicyRepositoryPort } from '../../../../domain/business-policy/business-policy.repository.port';
import { RepositoryScope } from '../../../../shared/context/request-context';
import { DomainError } from '../../../../domain/shared/domain-error';

export class BusinessPolicyPrismaRepository implements BusinessPolicyRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async createVersion(input: BusinessPolicyRecord, scope: RepositoryScope & { businessId: string }): Promise<BusinessPolicy> {
    await this.ensureBusiness(input.businessId, scope);
    const policyValueJson = this.requirePolicyValue(input.policyValueJson);
    try {
      const record = await this.prisma.$transaction(async (tx: Pick<PrismaClient, 'businessPolicy'>) => {
        const existing = await tx.businessPolicy.findFirst({ where: { businessId: input.businessId, policyKey: input.policyKey }, select: { id: true } });
        if (existing) throw new DomainError('POLICY_KEY_ALREADY_EXISTS', 'Policy key already exists.');
        return tx.businessPolicy.create({ data: { businessId: input.businessId, policyKey: input.policyKey, policyValueJson, version: 1 } });
      });
      return this.map(record);
    } catch (error) {
      if (this.isUniqueViolation(error)) throw new DomainError('POLICY_KEY_ALREADY_EXISTS', 'Policy key already exists.');
      throw error;
    }
  }

  async getCurrentByKey(policyKey: string, scope: RepositoryScope & { businessId: string }): Promise<BusinessPolicy | null> {
    const record = await this.prisma.businessPolicy.findFirst({ where: { businessId: scope.businessId, policyKey, business: { organizationId: scope.organizationId } }, orderBy: { version: 'desc' } });
    return record ? this.map(record) : null;
  }

  async getVersions(policyKey: string, scope: RepositoryScope & { businessId: string }): Promise<BusinessPolicy[]> {
    const records = await this.prisma.businessPolicy.findMany({ where: { businessId: scope.businessId, policyKey, business: { organizationId: scope.organizationId } }, orderBy: { version: 'asc' } });
    return records.map((record: BusinessPolicyPersistenceRecord) => this.map(record));
  }

  async appendVersion(input: BusinessPolicyRecord, expectedVersion: number, scope: RepositoryScope & { businessId: string }): Promise<BusinessPolicy> {
    await this.ensureBusiness(input.businessId, scope);
    const policyValueJson = this.requirePolicyValue(input.policyValueJson);
    try {
      const record = await this.prisma.$transaction(async (tx: Pick<PrismaClient, 'businessPolicy'>) => {
        const current = await tx.businessPolicy.findFirst({ where: { businessId: input.businessId, policyKey: input.policyKey }, orderBy: { version: 'desc' } });
        if (!current || current.version !== expectedVersion) throw new DomainError('POLICY_VERSION_CONFLICT', 'Policy version conflict.');
        return tx.businessPolicy.create({ data: { businessId: input.businessId, policyKey: input.policyKey, policyValueJson, version: expectedVersion + 1 } });
      });
      return this.map(record);
    } catch (error) {
      if (this.isUniqueViolation(error)) throw new DomainError('POLICY_VERSION_CONFLICT', 'Policy version conflict.');
      throw error;
    }
  }

  private async ensureBusiness(businessId: string, scope: RepositoryScope & { businessId: string }): Promise<void> {
    if (businessId !== scope.businessId || !(await this.prisma.business.findFirst({ where: { id: businessId, organizationId: scope.organizationId }, select: { id: true } }))) {
      throw new DomainError('BUSINESS_ACCESS_DENIED', 'Business is outside the organization scope.');
    }
  }

  private map(record: BusinessPolicyPersistenceRecord): BusinessPolicy {
    if (typeof record.policyValueJson !== 'object' || record.policyValueJson === null || Array.isArray(record.policyValueJson)) {
      throw new DomainError('INVALID_POLICY', 'Policy value must be a JSON object.');
    }
    return new BusinessPolicy({ ...record, policyValueJson: record.policyValueJson as Record<string, unknown> });
  }

  private requirePolicyValue(value: Record<string, unknown> | null): object {
    if (value === null || Array.isArray(value)) throw new DomainError('INVALID_POLICY', 'Policy value must be a JSON object.');
    return JSON.parse(JSON.stringify(value)) as object;
  }

  private isUniqueViolation(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
  }
}

type BusinessPolicyPersistenceRecord = {
  id: string;
  businessId: string;
  policyKey: string;
  policyValueJson: unknown;
  version: number;
  createdAt: Date;
  updatedAt: Date;
};
