import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';

export async function requireBusinessScope(
  businessRepository: BusinessRepositoryPort,
  context: BusinessContext,
): Promise<void> {
  const business = await businessRepository.getById(context.businessId, context);
  if (!business) {
    throw new ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
  }
}
