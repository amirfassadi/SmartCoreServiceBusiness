import { BusinessContext } from '../../../shared/context/request-context';
export interface ValidatedExternalContext {
    organizationId: string;
    actorId?: string;
}
export interface ExternalRequestContextAdapter {
    getValidatedContext(request: ValidatedExternalContext | undefined, businessId: string): BusinessContext;
}
export declare class HeaderExternalRequestContextAdapter implements ExternalRequestContextAdapter {
    getValidatedContext(request: ValidatedExternalContext | undefined, businessId: string): BusinessContext;
}
