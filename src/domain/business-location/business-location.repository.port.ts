import { BusinessLocation } from './entities/business-location.entity';
import { RepositoryScope } from '../../shared/context/request-context';

export type CreateBusinessLocationInput = {
  businessId: string;
  name: string;
  address?: string;
  timezone: string;
  active?: boolean;
};

export interface BusinessLocationRepositoryPort {
  create(input: CreateBusinessLocationInput, scope: RepositoryScope): Promise<BusinessLocation>;
  getById(id: string, scope: RepositoryScope & { businessId: string }): Promise<BusinessLocation | null>;
  listByBusiness(scope: RepositoryScope & { businessId: string }): Promise<BusinessLocation[]>;
  update(id: string, input: Partial<CreateBusinessLocationInput>, scope: RepositoryScope & { businessId: string }): Promise<BusinessLocation>;
  deactivate(id: string, scope: RepositoryScope & { businessId: string }): Promise<BusinessLocation>;
}
