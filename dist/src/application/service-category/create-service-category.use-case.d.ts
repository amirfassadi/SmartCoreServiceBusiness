import { ServiceCategory, ServiceCategoryInput } from '../../domain/service-category/entities/service-category.entity';
import { ServiceCategoryRepositoryPort } from '../../domain/service-category/service-category.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare class CreateServiceCategoryUseCase {
    private readonly businessRepository;
    private readonly serviceCategoryRepository;
    constructor(businessRepository: BusinessRepositoryPort, serviceCategoryRepository: ServiceCategoryRepositoryPort);
    execute(input: ServiceCategoryInput, context: BusinessContext): Promise<ServiceCategory>;
}
