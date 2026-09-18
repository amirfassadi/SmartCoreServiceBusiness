import { PrismaClient } from '@prisma/client';
import { Service } from '../../../../domain/service/entities/service.entity';
import { CreateServiceInput, ServiceRepositoryPort } from '../../../../domain/service/service.repository.port';
import { RepositoryScope } from '../../../../shared/context/request-context';
export declare class ServicePrismaRepository implements ServiceRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(input: CreateServiceInput, scope: RepositoryScope & {
        businessId: string;
    }): Promise<Service>;
    getById(id: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<Service | null>;
    listByBusiness(scope: RepositoryScope & {
        businessId: string;
    }): Promise<Service[]>;
    update(id: string, input: Partial<CreateServiceInput>, scope: RepositoryScope & {
        businessId: string;
    }): Promise<Service>;
    archive(id: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<Service>;
    validateCategoryOwnership(categoryId: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<boolean>;
    getBySlug(slug: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<Service | null>;
    private ensureScoped;
    private map;
    private isUniqueViolation;
}
