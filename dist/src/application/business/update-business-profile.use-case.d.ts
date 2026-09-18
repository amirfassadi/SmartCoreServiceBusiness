import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare class UpdateBusinessProfileUseCase {
    private readonly businessRepository;
    constructor(businessRepository: BusinessRepositoryPort);
    execute(id: string, input: {
        name?: string;
        description?: string;
        logoUrl?: string;
        contactEmail?: string;
    }, context: BusinessContext): Promise<import("../..").Business>;
}
