import { BusinessLocationRepositoryPort } from '../../domain/business-location/business-location.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';

export class GetBusinessLocationsUseCase {
  constructor(private readonly businessLocationRepository: BusinessLocationRepositoryPort) {}

  async execute(businessId: string, context: BusinessContext) {
    if (businessId !== context.businessId) {
      throw new ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
    }

    return this.businessLocationRepository.listByBusiness(context);
  }
}
