import { PrismaClient } from '@prisma/client';
import { Business } from '../../../../domain/business/entities/business.entity';
import { BusinessRepositoryPort, CreateBusinessCommand } from '../../../../domain/business/business.repository.port';
import { RepositoryScope } from '../../../../shared/context/request-context';
export declare class BusinessPrismaRepository implements BusinessRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(input: CreateBusinessCommand, scope: RepositoryScope): Promise<Business>;
    getById(id: string, scope: RepositoryScope): Promise<Business | null>;
    getBySlug(slug: string, scope: RepositoryScope): Promise<Business | null>;
    listByOrganization(scope: RepositoryScope): Promise<Business[]>;
    updateProfile(id: string, profile: Partial<{
        name: string;
        description?: string;
        logoUrl?: string;
        contactEmail?: string;
    }>, scope: RepositoryScope): Promise<Business>;
    private mapBusiness;
}
