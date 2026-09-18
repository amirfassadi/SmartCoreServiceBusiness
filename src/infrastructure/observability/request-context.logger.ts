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

export class RequestContextLogger {
  log(operation: string, context: RequestContext, entry: StructuredLogEntry): void {
    const details: StructuredLogEntry = {
      correlationId: context.correlationId,
      organizationId: context.organizationId,
      businessId: context.businessId,
      actorId: context.actorId,
      operation,
      ...entry,
    };

    // This is intentionally a boundary hook; no provider secrets are logged.
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(details));
  }
}
