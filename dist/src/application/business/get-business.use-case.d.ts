import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare class GetBusinessUseCase {
    private readonly businessRepository;
    constructor(businessRepository: BusinessRepositoryPort);
    execute(id: string, context: BusinessContext): Promise<{
        id: string;
        slug: string;
        organizationId: string;
    }>;
}
