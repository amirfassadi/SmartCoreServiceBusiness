import { Service } from '../../domain/service/entities/service.entity';
import { ServiceRepositoryPort } from '../../domain/service/service.repository.port';
import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
import { ValidationError } from '../../domain/shared/domain-error';
import { requireBusinessScope } from '../shared/require-business-scope';

export class GetServiceUseCase {
  constructor(private readonly businessRepository: BusinessRepositoryPort, private readonly serviceRepository: ServiceRepositoryPort) {}

  async execute(id: string, context: BusinessContext): Promise<Service> {
    await requireBusinessScope(this.businessRepository, context);
    const service = await this.serviceRepository.getById(id, context);
    if (!service) throw new ValidationError('Service was not found.', 'SERVICE_NOT_FOUND');
    return service;
  }
}