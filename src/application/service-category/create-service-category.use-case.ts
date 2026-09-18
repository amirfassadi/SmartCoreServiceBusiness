import { ServiceCategory, ServiceCategoryInput } from '../../domain/service-category/entities/service-category.entity';
import { ServiceCategoryRepositoryPort } from '../../domain/service-category/service-category.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';

export class CreateServiceCategoryUseCase {
  constructor(
    private readonly businessRepository: BusinessRepositoryPort,
    private readonly serviceCategoryRepository: ServiceCategoryRepositoryPort,
  ) {}

  async execute(input: ServiceCategoryInput, context: BusinessContext): Promise<ServiceCategory> {
    if (input.businessId !== context.businessId) {
      throw new ValidationError('Business access denied.', 'BUSINESS_ACCESS_DENIED');
    }

    if (!(await this.businessRepository.getById(context.businessId, context))) {
      throw new ValidationError('Business was not found.', 'BUSINESS_NOT_FOUND');
    }

    const scope = context;
    const existing = await this.serviceCategoryRepository.getBySlug(input.slug, scope);
    if (existing) {
      throw new ValidationError('Category slug already exists.', 'CATEGORY_SLUG_ALREADY_EXISTS');
    }

    if (input.parentCategoryId && !(await this.serviceCategoryRepository.validateParentOwnership(input.parentCategoryId, scope))) {
      throw new ValidationError('Invalid parent category.', 'INVALID_PARENT_CATEGORY');
    }

    return this.serviceCategoryRepository.create(input, scope);
  }
}
