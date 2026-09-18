import { BusinessRepositoryPort } from '../../domain/business/business.repository.port';
import { BusinessContext } from '../../shared/context/request-context';
export declare function requireBusinessScope(businessRepository: BusinessRepositoryPort, context: BusinessContext): Promise<void>;
