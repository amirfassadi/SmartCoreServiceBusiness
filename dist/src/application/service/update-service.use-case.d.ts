import { Service, ServiceInput } from '../../domain/service/entities/service.entity';
import { ServiceRepositoryPort } from '../../domain/service/service.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare class UpdateServiceUseCase {
    private readonly businessRepository;
    private readonly serviceRepository;
    constructor(businessRepository: BusinessRepositoryPort, serviceRepository: ServiceRepositoryPort);
    execute(serviceId: string, input: Partial<ServiceInput>, context: BusinessContext): Promise<Service>;
}
