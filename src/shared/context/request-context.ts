export interface OrganizationContext {
  organizationId: string;
  actorId?: string;
}

export interface BusinessContext extends OrganizationContext {
  businessId: string;
}

export interface RequestContext {
  correlationId: string;
  organizationId?: string;
  businessId?: string;
  actorId?: string;
  operation?: string;
}

export interface ScopeGuard {
  requireBusinessScope(context: BusinessContext): void;
}

export type RepositoryScope = OrganizationContext & {
  businessId?: string;
};
