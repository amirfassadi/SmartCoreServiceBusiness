import { BusinessLocation, BusinessLocationInput } from '../../domain/business-location/entities/business-location.entity';
import { BusinessLocationRepositoryPort } from '../../domain/business-location/business-location.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';
import { requireBusinessScope } from '../shared/require-business-scope';

export class AddBusinessLocationUseCase {
  constructor(
    private readonly businessRepository: BusinessRepositoryPort,
    private readonly businessLocationRepository: BusinessLocationRepositoryPort,
  ) {}

  async execute(input: BusinessLocationInput, context: BusinessContext): Promise<BusinessLocation> {
    if (input.businessId !== context.businessId) {
      throw new ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
    }

    await requireBusinessScope(this.businessRepository, context);

    const location = BusinessLocation.create(input);
    return this.businessLocationRepository.create({
      businessId: location.businessId,
      name: location.name,
      address: location.address,
      timezone: location.timezone,
      active: location.active,
    }, context);
  }
}
