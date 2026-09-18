import { ServiceCategory } from '../../domain/service-category/entities/service-category.entity';
import { ServiceCategoryRepositoryPort } from '../../domain/service-category/service-category.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { requireBusinessScope } from '../shared/require-business-scope';

export class GetServiceCategoriesUseCase {
  constructor(
    private readonly businessRepository: BusinessRepositoryPort,
    private readonly categoryRepository: ServiceCategoryRepositoryPort,
  ) {}

  async execute(context: BusinessContext): Promise<ServiceCategory[]> {
    await requireBusinessScope(this.businessRepository, context);
    return this.categoryRepository.listByBusiness(context);
  }
}
