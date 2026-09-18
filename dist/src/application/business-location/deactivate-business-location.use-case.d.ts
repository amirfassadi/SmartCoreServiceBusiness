import { BusinessLocation } from '../../domain/business-location/entities/business-location.entity';
import { BusinessLocationRepositoryPort } from '../../domain/business-location/business-location.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare class DeactivateBusinessLocationUseCase {
    private readonly businessRepository;
    private readonly locationRepository;
    constructor(businessRepository: BusinessRepositoryPort, locationRepository: BusinessLocationRepositoryPort);
    execute(locationId: string, context: BusinessContext): Promise<BusinessLocation>;
}
