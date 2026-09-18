import { PrismaClient } from '@prisma/client';
import { BusinessPolicy } from '../../../../domain/business-policy/entities/business-policy.entity';
import { BusinessPolicyRecord, BusinessPolicyRepositoryPort } from '../../../../domain/business-policy/business-policy.repository.port';
import { RepositoryScope } from '../../../../shared/context/request-context';
export declare class BusinessPolicyPrismaRepository implements BusinessPolicyRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    createVersion(input: BusinessPolicyRecord, scope: RepositoryScope & {
        businessId: string;
    }): Promise<BusinessPolicy>;
    getCurrentByKey(policyKey: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<BusinessPolicy | null>;
    getVersions(policyKey: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<BusinessPolicy[]>;
    appendVersion(input: BusinessPolicyRecord, expectedVersion: number, scope: RepositoryScope & {
        businessId: string;
    }): Promise<BusinessPolicy>;
    private ensureBusiness;
    private map;
    private requirePolicyValue;
    private isUniqueViolation;
}
