import { BusinessPolicy, BusinessPolicyInput } from '../../domain/business-policy/entities/business-policy.entity';
import { BusinessPolicyRepositoryPort } from '../../domain/business-policy/business-policy.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';

export class CreateBusinessPolicyUseCase {
  constructor(
    private readonly businessRepository: BusinessRepositoryPort,
    private readonly policyRepository: BusinessPolicyRepositoryPort,
  ) {}

  async execute(input: BusinessPolicyInput, context: BusinessContext): Promise<BusinessPolicy> {
    if (input.businessId !== context.businessId) {
      throw new ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
    }

    if (!(await this.businessRepository.getById(context.businessId, context))) {
      throw new ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
    }

    const existing = await this.policyRepository.getCurrentByKey(input.policyKey, context);
    if (existing) {
      throw new ValidationError('Policy key already exists.', 'POLICY_KEY_ALREADY_EXISTS');
    }

    return this.policyRepository.createVersion({
      businessId: input.businessId,
      policyKey: input.policyKey,
      policyValueJson: input.policyValueJson,
    }, context);
  }
}
