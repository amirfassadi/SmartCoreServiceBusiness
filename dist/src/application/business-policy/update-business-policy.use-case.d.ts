import { BusinessPolicy } from '../../domain/business-policy/entities/business-policy.entity';
import { BusinessPolicyRepositoryPort } from '../../domain/business-policy/business-policy.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare class UpdateBusinessPolicyUseCase {
    private readonly businessRepository;
    private readonly policyRepository;
    constructor(businessRepository: BusinessRepositoryPort, policyRepository: BusinessPolicyRepositoryPort);
    execute(policyKey: string, policyValueJson: Record<string, unknown>, context: BusinessContext): Promise<BusinessPolicy>;
}
