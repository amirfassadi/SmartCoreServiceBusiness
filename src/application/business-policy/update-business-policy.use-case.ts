import { BusinessPolicy } from '../../domain/business-policy/entities/business-policy.entity';
import { BusinessPolicyRepositoryPort } from '../../domain/business-policy/business-policy.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';
import { requireBusinessScope } from '../shared/require-business-scope';

export class UpdateBusinessPolicyUseCase {
  constructor(
    private readonly businessRepository: BusinessRepositoryPort,
    private readonly policyRepository: BusinessPolicyRepositoryPort,
  ) {}

  async execute(
    policyKey: string,
    policyValueJson: Record<string, unknown>,
    context: BusinessContext,
  ): Promise<BusinessPolicy> {
    await requireBusinessScope(this.businessRepository, context);
    const current = await this.policyRepository.getCurrentByKey(policyKey, context);
    if (!current) throw new ValidationError('Policy was not found.', 'POLICY_NOT_FOUND');
    return this.policyRepository.appendVersion(
      { businessId: context.businessId, policyKey, policyValueJson },
      current.version,
      context,
    );
  }
}
