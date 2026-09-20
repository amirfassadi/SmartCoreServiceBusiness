import { Service, ServiceInput } from '../../domain/service/entities/service.entity';
import { ServiceRepositoryPort } from '../../domain/service/service.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';
import { requireBusinessScope } from '../shared/require-business-scope';

export class UpdateServiceUseCase {
  constructor(
    private readonly businessRepository: BusinessRepositoryPort,
    private readonly serviceRepository: ServiceRepositoryPort,
  ) {}

  async execute(serviceId: string, input: Partial<ServiceInput>, context: BusinessContext): Promise<Service> {
    await requireBusinessScope(this.businessRepository, context);
    const service = await this.serviceRepository.getById(serviceId, context);
    if (!service) throw new ValidationError('Service was not found.', 'SERVICE_NOT_FOUND');
    if (service.archivedAt) throw new ValidationError('Archived services cannot be updated.', 'SERVICE_ARCHIVED');
    if (input.categoryId && !(await this.serviceRepository.validateCategoryOwnership(input.categoryId, context))) {
      throw new ValidationError('Invalid service category.', 'INVALID_SERVICE_CATEGORY');
    }
    if (input.slug && input.slug !== service.slug && await this.serviceRepository.getBySlug(input.slug, context)) {
      throw new ValidationError('Service slug already exists.', 'SERVICE_SLUG_ALREADY_EXISTS');
    }
    return this.serviceRepository.update(serviceId, input, context);
  }
}
