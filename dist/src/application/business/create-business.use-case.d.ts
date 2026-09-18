import { Business, BusinessCreateInput } from '../../domain/business/entities/business.entity';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare class CreateBusinessUseCase {
    private readonly businessRepository;
    constructor(businessRepository: BusinessRepositoryPort);
    execute(input: BusinessCreateInput, context: BusinessContext): Promise<Business>;
}
