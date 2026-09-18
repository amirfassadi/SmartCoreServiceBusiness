import { Business, BusinessCreateInput } from '../../domain/business/entities/business.entity';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';

export class CreateBusinessUseCase {
  constructor(private readonly businessRepository: BusinessRepositoryPort) {}

  async execute(input: BusinessCreateInput, context: BusinessContext): Promise<Business> {
    const existing = await this.businessRepository.getBySlug(input.slug, context);
    if (existing) {
      throw new ValidationError('Business slug already exists.', 'BUSINESS_SLUG_ALREADY_EXISTS');
    }

    return this.businessRepository.create(input, context);
  }
}
