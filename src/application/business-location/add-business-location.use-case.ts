import { BusinessLocation, BusinessLocationInput } from '../../domain/business-location/entities/business-location.entity';
import { BusinessLocationRepositoryPort } from '../../domain/business-location/business-location.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';

export class AddBusinessLocationUseCase {
  constructor(
    private readonly businessRepository: BusinessRepositoryPort,
    private readonly businessLocationRepository: BusinessLocationRepositoryPort,
  ) {}

  async execute(input: BusinessLocationInput, context: BusinessContext): Promise<BusinessLocation> {
    if (input.businessId !== context.businessId) {
      throw new ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
    }

    if (!(await this.businessRepository.getById(context.businessId, context))) {
      throw new ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
    }

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
