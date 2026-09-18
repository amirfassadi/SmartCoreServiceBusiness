import { PrismaClient } from '@prisma/client';
import { BusinessLocation } from '../../../../domain/business-location/entities/business-location.entity';
import { BusinessLocationRepositoryPort, CreateBusinessLocationInput } from '../../../../domain/business-location/business-location.repository.port';
import { RepositoryScope } from '../../../../shared/context/request-context';
export declare class BusinessLocationPrismaRepository implements BusinessLocationRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(input: CreateBusinessLocationInput, scope: RepositoryScope): Promise<BusinessLocation>;
    getById(id: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<BusinessLocation | null>;
    listByBusiness(scope: RepositoryScope & {
        businessId: string;
    }): Promise<BusinessLocation[]>;
    update(id: string, input: Partial<CreateBusinessLocationInput>, scope: RepositoryScope & {
        businessId: string;
    }): Promise<BusinessLocation>;
    deactivate(id: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<BusinessLocation>;
    private ensureScoped;
    private map;
    private isUniqueViolation;
}
