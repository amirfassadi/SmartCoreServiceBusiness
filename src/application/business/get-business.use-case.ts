import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';

export class GetBusinessUseCase {
  constructor(private readonly businessRepository: BusinessRepositoryPort) {}

  async execute(id: string, context: BusinessContext): Promise<{ id: string; slug: string; organizationId: string }> {
    const business = await this.businessRepository.getById(id, context);
    if (!business) {
      throw new ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
    }

    return { id: business.id, slug: business.slug, organizationId: business.organizationId };
  }
}
