import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';
import { Business } from '../../domain/business/entities/business.entity';

export async function requireBusinessScope(
  businessRepository: BusinessRepositoryPort,
  context: BusinessContext,
  options: { allowArchived?: boolean } = {},
): Promise<Business> {
  const business = await businessRepository.getById(context.businessId, context);
  if (!business) {
    throw new ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
  }
  if (!options.allowArchived && business.status?.toString() === 'archived') {
    throw new ValidationError('Archived business cannot accept new active operations.', 'BUSINESS_ARCHIVED');
  }
  return business;
}
