import { BusinessPolicy } from '../../domain/business-policy/entities/business-policy.entity';
import { BusinessPolicyRepositoryPort } from '../../domain/business-policy/business-policy.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { requireBusinessScope } from '../shared/require-business-scope';

export class GetBusinessPolicyVersionsUseCase {
  constructor(
    private readonly businessRepository: BusinessRepositoryPort,
    private readonly policyRepository: BusinessPolicyRepositoryPort,
  ) {}

  async execute(policyKey: string, context: BusinessContext): Promise<BusinessPolicy[]> {
    await requireBusinessScope(this.businessRepository, context);
    return this.policyRepository.getVersions(policyKey, context);
  }
}
