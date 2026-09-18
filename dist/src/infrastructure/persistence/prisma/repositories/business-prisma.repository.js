"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessPrismaRepository = void 0;
const business_entity_1 = require("../../../../domain/business/entities/business.entity");
class BusinessPrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(input, scope) {
        const created = await this.prisma.$transaction(async (tx) => {
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
                profile: new business_entity_1.BusinessProfile({
                    id: profile.id,
                    businessId: business.id,
                    name: profile.name,
                    description: profile.description ?? undefined,
                    logoUrl: profile.logoUrl ?? undefined,
                    contactEmail: profile.contactEmail ?? undefined,
                    createdAt: profile.createdAt,
                    updatedAt: profile.updatedAt,
                }),
            };
        });
        return new business_entity_1.Business({
            id: created.id,
            organizationId: created.organizationId,
            slug: created.slug,
            defaultLocale: created.defaultLocale,
            supportedLocales: Array.isArray(created.supportedLocales) ? created.supportedLocales : [],
            timezone: created.timezone,
            currency: created.currency,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
            profile: created.profile,
        });
    }
    async getById(id, scope) {
        const record = await this.prisma.business.findFirst({
            where: { id, organizationId: scope.organizationId },
            include: { profile: true },
        });
        if (!record)
            return null;
        return this.mapBusiness(record);
    }
    async getBySlug(slug, scope) {
        const record = await this.prisma.business.findFirst({
            where: { organizationId: scope.organizationId, slug },
            include: { profile: true },
        });
        return record ? this.mapBusiness(record) : null;
    }
    async listByOrganization(scope) {
        const records = await this.prisma.business.findMany({
            where: { organizationId: scope.organizationId },
            include: { profile: true },
        });
        return records.map((record) => this.mapBusiness(record));
    }
    async updateProfile(id, profile, scope) {
        await this.prisma.businessProfile.updateMany({
            where: { businessId: id, business: { organizationId: scope.organizationId } },
            data: { ...profile },
        });
        const business = await this.prisma.business.findUnique({
            where: { id, organizationId: scope.organizationId },
            include: { profile: true },
        });
        if (!business)
            throw new Error('BUSINESS_NOT_FOUND');
        return this.mapBusiness(business);
    }
    mapBusiness(record) {
        return new business_entity_1.Business({
            id: record.id,
            organizationId: record.organizationId,
            slug: record.slug,
            defaultLocale: record.defaultLocale,
            supportedLocales: Array.isArray(record.supportedLocales) ? record.supportedLocales : [],
            timezone: record.timezone,
            currency: record.currency,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            profile: new business_entity_1.BusinessProfile({
                id: record.profile?.id,
                businessId: record.id,
                name: record.profile?.name ?? '',
                description: record.profile?.description ?? undefined,
                logoUrl: record.profile?.logoUrl ?? undefined,
                contactEmail: record.profile?.contactEmail ?? undefined,
                createdAt: record.profile?.createdAt,
                updatedAt: record.profile?.updatedAt,
            }),
        });
    }
}
exports.BusinessPrismaRepository = BusinessPrismaRepository;
