import { BusinessPolicy } from './entities/business-policy.entity';
import { RepositoryScope } from '../../shared/context/request-context';
export type BusinessPolicyRecord = {
    businessId: string;
    policyKey: string;
    policyValueJson: Record<string, unknown> | null;
};
export interface BusinessPolicyRepositoryPort {
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
}
