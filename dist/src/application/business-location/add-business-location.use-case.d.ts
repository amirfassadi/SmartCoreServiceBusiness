import { BusinessLocation, BusinessLocationInput } from '../../domain/business-location/entities/business-location.entity';
import { BusinessLocationRepositoryPort } from '../../domain/business-location/business-location.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare class AddBusinessLocationUseCase {
    private readonly businessRepository;
    private readonly businessLocationRepository;
    constructor(businessRepository: BusinessRepositoryPort, businessLocationRepository: BusinessLocationRepositoryPort);
    execute(input: BusinessLocationInput, context: BusinessContext): Promise<BusinessLocation>;
}
