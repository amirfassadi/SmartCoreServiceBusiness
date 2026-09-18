import { BusinessContext } from '../../../shared/context/request-context';
import { ValidationError } from '../../../domain/shared/domain-error';

export interface ValidatedExternalContext {
  organizationId: string;
  actorId?: string;
}

export interface ExternalRequestContextAdapter {
  getValidatedContext(request: ValidatedExternalContext | undefined, businessId: string): BusinessContext;
}

export class ValidatedExternalRequestContextAdapter implements ExternalRequestContextAdapter {
  getValidatedContext(request: ValidatedExternalContext | undefined, businessId: string): BusinessContext {
    if (!request?.organizationId || !request.organizationId.trim()) {
      throw new ValidationError('Validated organization context is required.', 'BUSINESS_ACCESS_DENIED');
    }

    return {
      organizationId: request.organizationId,
      actorId: request.actorId,
      businessId,
    };
  }
}
