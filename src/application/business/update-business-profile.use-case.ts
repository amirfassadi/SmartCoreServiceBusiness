import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';

export class UpdateBusinessProfileUseCase {
  constructor(private readonly businessRepository: BusinessRepositoryPort) {}

  async execute(id: string, input: { name?: string; description?: string; logoUrl?: string; contactEmail?: string }, context: BusinessContext) {
    const business = await this.businessRepository.getById(id, context);
    if (!business) {
      throw new ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
    }

    return this.businessRepository.updateProfile(id, input, context);
  }
}
