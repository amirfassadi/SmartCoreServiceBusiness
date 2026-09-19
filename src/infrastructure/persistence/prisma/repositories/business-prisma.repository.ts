import { PrismaClient } from '@prisma/client';
import { Business, BusinessProfile } from '../../../../domain/business/entities/business.entity';
import { BusinessStatus } from '../../../../domain/shared/business-status.value-object';
import { BusinessRepositoryPort, CreateBusinessCommand } from '../../../../domain/business/business.repository.port';
import { RepositoryScope } from '../../../../shared/context/request-context';
import { DomainError } from '../../../../domain/shared/domain-error';

export class BusinessPrismaRepository implements BusinessRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateBusinessCommand, scope: RepositoryScope): Promise<Business> {
    const created = await this.prisma.$transaction(async (tx: Pick<PrismaClient, 'business' | 'businessProfile'>) => {
      const business = await tx.business.create({
        data: {
          organizationId: scope.organizationId,
          slug: input.slug,
          defaultLocale: input.defaultLocale,
          supportedLocales: input.supportedLocales,
          timezone: input.timezone,
          currency: input.currency,
          status: 'draft',
        },
      });

      const profile = await tx.businessProfile.create({
        data: {
          businessId: business.id,
          name: input.profile.name,
          description: input.profile.description ?? null,
          logoUrl: input.profile.logoUrl ?? null,
          contactEmail: input.profile.contactEmail ?? null,
        },
      });

      return {
        ...business,
        profile: new BusinessProfile({
          id: profile.id,
          businessId: business.id,
          name: profile.name,
          description: profile.description ?? undefined,
          logoUrl: profile.logoUrl ?? undefined,
          contactEmail: profile.contactEmail ?? undefined,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        }),
      } as unknown as Business;
    });

    return new Business({
      id: created.id,
      organizationId: created.organizationId,
      slug: created.slug,
      defaultLocale: created.defaultLocale,
      supportedLocales: Array.isArray(created.supportedLocales) ? (created.supportedLocales as string[]) : [],
      timezone: created.timezone,
      currency: created.currency,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      profile: created.profile,
    });
  }

  async getById(id: string, scope: RepositoryScope): Promise<Business | null> {
    const record = await this.prisma.business.findFirst({
      where: { id, organizationId: scope.organizationId },
      include: { profile: true },
    });

    if (!record) return null;
    return this.mapBusiness(record);
  }

  async getBySlug(slug: string, scope: RepositoryScope): Promise<Business | null> {
    const record = await this.prisma.business.findFirst({
      where: { organizationId: scope.organizationId, slug },
      include: { profile: true },
    });
    return record ? this.mapBusiness(record) : null;
  }

  async listByOrganization(scope: RepositoryScope): Promise<Business[]> {
    const records = await this.prisma.business.findMany({
      where: { organizationId: scope.organizationId },
      include: { profile: true },
    });
    return records.map((record: BusinessRecord) => this.mapBusiness(record));
  }

  async updateProfile(id: string, profile: Partial<{ name: string; description?: string; logoUrl?: string; contactEmail?: string }>, scope: RepositoryScope): Promise<Business> {
    const business = await this.prisma.business.findFirst({
      where: { id, organizationId: scope.organizationId },
      select: { id: true },
    });
    if (!business) throw new DomainError('BUSINESS_NOT_FOUND', 'Business was not found in the organization scope.');

    const updateResult = await this.prisma.businessProfile.updateMany({
      where: { businessId: id, business: { organizationId: scope.organizationId } },
      data: { ...profile },
    });
    if (updateResult.count === 0) throw new DomainError('PROFILE_NOT_FOUND', 'Business profile was not found.');

    const updatedBusiness = await this.prisma.business.findFirst({
      where: { id, organizationId: scope.organizationId },
      include: { profile: true },
    });

    if (!updatedBusiness) throw new DomainError('BUSINESS_NOT_FOUND', 'Business was not found in the organization scope.');
    return this.mapBusiness(updatedBusiness);
  }

  private mapBusiness(record: BusinessRecord): Business {
    if (!record.profile) {
      throw new DomainError('PROFILE_NOT_FOUND', 'Business profile was not found.');
    }

    return new Business({
      id: record.id,
      organizationId: record.organizationId,
      slug: record.slug,
      defaultLocale: record.defaultLocale,
      supportedLocales: Array.isArray(record.supportedLocales) ? record.supportedLocales : [],
      timezone: record.timezone,
      currency: record.currency,
      status: BusinessStatus.create(record.status),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      profile: new BusinessProfile({
        id: record.profile.id,
        businessId: record.id,
        name: record.profile.name,
        description: record.profile.description ?? undefined,
        logoUrl: record.profile.logoUrl ?? undefined,
        contactEmail: record.profile.contactEmail ?? undefined,
        createdAt: record.profile.createdAt,
        updatedAt: record.profile.updatedAt,
      }),
    });
  }
}

type BusinessRecord = {
  id: string;
  organizationId: string;
  slug: string;
  defaultLocale: string;
  supportedLocales: unknown;
  timezone: string;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  profile: {
    id: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    contactEmail: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};
