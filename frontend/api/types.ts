export type LifecycleStatus = "active" | "archived" | "all";

export type BusinessStatus = "draft" | "active" | "suspended" | "archived";

export type BusinessProfile = {
  id: string;
  businessId: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  contactEmail?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Business = {
  id: string;
  organizationId: string;
  slug: string;
  defaultLocale: string;
  supportedLocales: string[];
  timezone: string;
  currency: string;
  status: BusinessStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  profile?: BusinessProfile;
};

export type CreateBusinessRequest = {
  slug: string;
  defaultLocale: string;
  supportedLocales: string[];
  timezone: string;
  currency: string;
  profileName: string;
  profileDescription?: string;
  profileLogoUrl?: string;
  profileContactEmail?: string;
};

export type UpdateBusinessProfileRequest = {
  name?: string;
  description?: string;
  logoUrl?: string;
  contactEmail?: string;
};

export type BusinessLocation = {
  id: string;
  businessId: string;
  name: string;
  address?: string | null;
  timezone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateLocationRequest = {
  name: string;
  address?: string;
  timezone: string;
};

export type UpdateLocationRequest = {
  name?: string;
  address?: string;
  timezone?: string;
};

export type ServiceCategory = {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  parentCategoryId?: string | null;
  status: LifecycleStatus;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateServiceCategoryRequest = {
  name: string;
  slug: string;
  parentCategoryId?: string;
};

export type UpdateServiceCategoryRequest = {
  name?: string;
  slug?: string;
  parentCategoryId?: string;
};

export type Service = {
  id: string;
  businessId: string;
  categoryId: string;
  name: string;
  slug: string;
  durationMinutes: number;
  status: LifecycleStatus;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateServiceRequest = {
  categoryId: string;
  name: string;
  slug: string;
  durationMinutes: number;
};

export type UpdateServiceRequest = {
  categoryId?: string;
  name?: string;
  slug?: string;
  durationMinutes?: number;
};

export type BusinessPolicy = {
  id: string;
  businessId: string;
  policyKey: string;
  policyValueJson: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type PolicyVersion = BusinessPolicy;

export type CreatePolicyRequest = {
  policyKey: string;
  policyValueJson: Record<string, unknown>;
};

export type UpdatePolicyRequest = {
  policyValueJson: Record<string, unknown>;
};
