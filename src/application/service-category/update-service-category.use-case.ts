import { ServiceCategory } from '../../domain/service-category/entities/service-category.entity';
import { CreateServiceCategoryInput, ServiceCategoryRepositoryPort } from '../../domain/service-category/service-category.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';
import { requireBusinessScope } from '../shared/require-business-scope';

export class UpdateServiceCategoryUseCase {
  constructor(private readonly businessRepository: BusinessRepositoryPort, private readonly categoryRepository: ServiceCategoryRepositoryPort) {}

  async execute(id: string, input: Partial<CreateServiceCategoryInput>, context: BusinessContext): Promise<ServiceCategory> {
    await requireBusinessScope(this.businessRepository, context);
    const category = await this.categoryRepository.getById(id, context);
    if (!category) throw new ValidationError('Category was not found.', 'CATEGORY_NOT_FOUND');
    if (category.archivedAt) throw new ValidationError('Archived categories cannot be updated.', 'CATEGORY_ARCHIVED');
    if (input.slug && input.slug !== category.slug && await this.categoryRepository.getBySlug(input.slug, context)) throw new ValidationError('Category slug already exists.', 'CATEGORY_SLUG_ALREADY_EXISTS');
    return this.categoryRepository.update(id, input, context);
  }
}