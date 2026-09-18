import { BusinessLocation } from '../../domain/business-location/entities/business-location.entity';
import { BusinessLocationRepositoryPort } from '../../domain/business-location/business-location.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';
import { requireBusinessScope } from '../shared/require-business-scope';

export class DeactivateBusinessLocationUseCase {
  constructor(
    private readonly businessRepository: BusinessRepositoryPort,
    private readonly locationRepository: BusinessLocationRepositoryPort,
  ) {}

  async execute(locationId: string, context: BusinessContext): Promise<BusinessLocation> {
    await requireBusinessScope(this.businessRepository, context);
    const location = await this.locationRepository.getById(locationId, context);
    if (!location) throw new ValidationError('Location was not found.', 'LOCATION_NOT_FOUND');
    if (location.businessId !== context.businessId) {
      throw new ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
    }
    return this.locationRepository.deactivate(locationId, context);
  }
}
