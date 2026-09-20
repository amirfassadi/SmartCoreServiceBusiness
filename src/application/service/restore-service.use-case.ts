import { Service } from '../../domain/service/entities/service.entity';
import { ServiceRepositoryPort } from '../../domain/service/service.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { requireBusinessScope } from '../shared/require-business-scope';

export class RestoreServiceUseCase {
  constructor(private readonly businessRepository: BusinessRepositoryPort, private readonly serviceRepository: ServiceRepositoryPort) {}

  async execute(serviceId: string, context: BusinessContext): Promise<Service> {
    await requireBusinessScope(this.businessRepository, context);
    return this.serviceRepository.restore(serviceId, context);
  }
}