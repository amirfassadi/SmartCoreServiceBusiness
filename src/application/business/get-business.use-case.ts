import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';
import { Business } from '../../domain/business/entities/business.entity';

export class GetBusinessUseCase {
  constructor(private readonly businessRepository: BusinessRepositoryPort) {}

  async execute(id: string, context: BusinessContext): Promise<Business> {
    const business = await this.businessRepository.getById(id, context);
    if (!business) {
      throw new ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
    }

    return business;
  }
}
