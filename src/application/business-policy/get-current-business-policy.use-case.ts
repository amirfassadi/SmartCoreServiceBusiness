import { BusinessPolicy } from '../../domain/business-policy/entities/business-policy.entity';
import { BusinessPolicyRepositoryPort } from '../../domain/business-policy/business-policy.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';
import { requireBusinessScope } from '../shared/require-business-scope';

export class GetCurrentBusinessPolicyUseCase {
  constructor(
    private readonly businessRepository: BusinessRepositoryPort,
    private readonly policyRepository: BusinessPolicyRepositoryPort,
  ) {}

  async execute(policyKey: string, context: BusinessContext): Promise<BusinessPolicy> {
    await requireBusinessScope(this.businessRepository, context);
    const policy = await this.policyRepository.getCurrentByKey(policyKey, context);
    if (!policy) throw new ValidationError('Policy was not found.', 'POLICY_NOT_FOUND');
    return policy;
  }
}
