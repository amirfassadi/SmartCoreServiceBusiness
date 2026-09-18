import { Service, ServiceInput } from '../../domain/service/entities/service.entity';
import { ServiceRepositoryPort } from '../../domain/service/service.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';

export class CreateServiceUseCase {
  constructor(
    private readonly businessRepository: BusinessRepositoryPort,
    private readonly serviceRepository: ServiceRepositoryPort,
  ) {}

  async execute(input: ServiceInput, context: BusinessContext): Promise<Service> {
    if (input.businessId !== context.businessId) {
      throw new ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
    }

    if (!(await this.businessRepository.getById(context.businessId, context))) {
      throw new ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
    }

    if (!(await this.serviceRepository.validateCategoryOwnership(input.categoryId, context))) {
      throw new ValidationError('Invalid service category.', 'INVALID_SERVICE_CATEGORY');
    }
    if (await this.serviceRepository.getBySlug(input.slug, context)) {
      throw new ValidationError('Service slug already exists.', 'SERVICE_SLUG_ALREADY_EXISTS');
    }

    return this.serviceRepository.create(input, context);
  }
}
