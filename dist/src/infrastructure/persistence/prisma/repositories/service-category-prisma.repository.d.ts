import { PrismaClient } from '@prisma/client';
import { ServiceCategory } from '../../../../domain/service-category/entities/service-category.entity';
import { CreateServiceCategoryInput, ServiceCategoryRepositoryPort } from '../../../../domain/service-category/service-category.repository.port';
import { RepositoryScope } from '../../../../shared/context/request-context';
export declare class ServiceCategoryPrismaRepository implements ServiceCategoryRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(input: CreateServiceCategoryInput, scope: RepositoryScope & {
        businessId: string;
    }): Promise<ServiceCategory>;
    getById(id: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<ServiceCategory | null>;
    listByBusiness(scope: RepositoryScope & {
        businessId: string;
    }): Promise<ServiceCategory[]>;
    getBySlug(slug: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<ServiceCategory | null>;
    validateParentOwnership(parentCategoryId: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<boolean>;
    private map;
    private isUniqueViolation;
}
