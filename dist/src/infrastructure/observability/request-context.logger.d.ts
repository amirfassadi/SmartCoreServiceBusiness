import { RequestContext } from '../../shared/context/request-context';
export interface StructuredLogEntry {
    correlationId?: string;
    organizationId?: string;
    businessId?: string;
    actorId?: string;
    operation?: string;
    outcome?: 'success' | 'failure';
    latencyMs?: number;
    dependency?: string;
    errorCode?: string;
}
export declare class RequestContextLogger {
    log(operation: string, context: RequestContext, entry: StructuredLogEntry): void;
}
