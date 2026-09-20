import { ServiceCategory } from './entities/service-category.entity';
import { RepositoryScope } from '../../shared/context/request-context';

export type CreateServiceCategoryInput = {
  businessId: string;
  name: string;
  slug: string;
  parentCategoryId?: string;
  archivedAt?: Date;
};

export type CategoryLifecycleStatus = 'active' | 'archived' | 'all';

export interface ServiceCategoryRepositoryPort {
  create(input: CreateServiceCategoryInput, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory>;
  getById(id: string, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory | null>;
  listByBusiness(status: CategoryLifecycleStatus, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory[]>;
  getBySlug(slug: string, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory | null>;
  validateParentOwnership(parentCategoryId: string, scope: RepositoryScope & { businessId: string }): Promise<boolean>;
  update(id: string, input: Partial<CreateServiceCategoryInput>, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory>;
  archive(id: string, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory>;
  restore(id: string, scope: RepositoryScope & { businessId: string }): Promise<ServiceCategory>;
  hasActiveServices(id: string, scope: RepositoryScope & { businessId: string }): Promise<boolean>;
}
