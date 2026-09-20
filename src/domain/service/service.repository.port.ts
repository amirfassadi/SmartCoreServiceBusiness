import { Service } from './entities/service.entity';
import { RepositoryScope } from '../../shared/context/request-context';

export type CreateServiceInput = {
  businessId: string;
  categoryId: string;
  name: string;
  slug: string;
  durationMinutes: number;
  archivedAt?: Date;
};

export type LifecycleStatus = 'active' | 'archived' | 'all';

export interface ServiceRepositoryPort {
  create(input: CreateServiceInput, scope: RepositoryScope & { businessId: string }): Promise<Service>;
  getById(id: string, scope: RepositoryScope & { businessId: string }): Promise<Service | null>;
  listByBusiness(status: LifecycleStatus, scope: RepositoryScope & { businessId: string }): Promise<Service[]>;
  update(id: string, input: Partial<CreateServiceInput>, scope: RepositoryScope & { businessId: string }): Promise<Service>;
  archive(id: string, scope: RepositoryScope & { businessId: string }): Promise<Service>;
  restore(id: string, scope: RepositoryScope & { businessId: string }): Promise<Service>;
  validateCategoryOwnership(categoryId: string, scope: RepositoryScope & { businessId: string }): Promise<boolean>;
  getBySlug(slug: string, scope: RepositoryScope & { businessId: string }): Promise<Service | null>;
}
