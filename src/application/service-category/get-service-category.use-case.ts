import { ServiceCategory } from '../../domain/service-category/entities/service-category.entity';
import { ServiceCategoryRepositoryPort } from '../../domain/service-category/service-category.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';
import { requireBusinessScope } from '../shared/require-business-scope';

export class GetServiceCategoryUseCase {
  constructor(private readonly businessRepository: BusinessRepositoryPort, private readonly categoryRepository: ServiceCategoryRepositoryPort) {}

  async execute(id: string, context: BusinessContext): Promise<ServiceCategory> {
    await requireBusinessScope(this.businessRepository, context);
    const category = await this.categoryRepository.getById(id, context);
    if (!category) throw new ValidationError('Category was not found.', 'CATEGORY_NOT_FOUND');
    return category;
  }
}