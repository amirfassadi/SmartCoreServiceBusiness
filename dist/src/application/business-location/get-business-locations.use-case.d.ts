import { BusinessLocationRepositoryPort } from '../../domain/business-location/business-location.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare class GetBusinessLocationsUseCase {
    private readonly businessLocationRepository;
    constructor(businessLocationRepository: BusinessLocationRepositoryPort);
    execute(businessId: string, context: BusinessContext): Promise<import("../..").BusinessLocation[]>;
}
