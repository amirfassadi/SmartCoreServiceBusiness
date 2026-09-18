import { BusinessPolicy } from '../../domain/business-policy/entities/business-policy.entity';
import { BusinessPolicyRepositoryPort } from '../../domain/business-policy/business-policy.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare class GetCurrentBusinessPolicyUseCase {
    private readonly businessRepository;
    private readonly policyRepository;
    constructor(businessRepository: BusinessRepositoryPort, policyRepository: BusinessPolicyRepositoryPort);
    execute(policyKey: string, context: BusinessContext): Promise<BusinessPolicy>;
}
