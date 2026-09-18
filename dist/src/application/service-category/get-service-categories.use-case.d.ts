import { ServiceCategory } from '../../domain/service-category/entities/service-category.entity';
import { ServiceCategoryRepositoryPort } from '../../domain/service-category/service-category.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare class GetServiceCategoriesUseCase {
    private readonly businessRepository;
    private readonly categoryRepository;
    constructor(businessRepository: BusinessRepositoryPort, categoryRepository: ServiceCategoryRepositoryPort);
    execute(context: BusinessContext): Promise<ServiceCategory[]>;
}
