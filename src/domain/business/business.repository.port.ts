import { Business, BusinessProfileInput } from './entities/business.entity';
import { RepositoryScope } from '../../shared/context/request-context';

export type CreateBusinessCommand = {
  slug: string;
  defaultLocale: string;
  supportedLocales: string[];
  timezone: string;
  currency: string;
  profile: BusinessProfileInput;
};

export interface BusinessRepositoryPort {
  create(input: CreateBusinessCommand, scope: RepositoryScope): Promise<Business>;
  getById(id: string, scope: RepositoryScope): Promise<Business | null>;
  getBySlug(slug: string, scope: RepositoryScope): Promise<Business | null>;
  listByOrganization(scope: RepositoryScope): Promise<Business[]>;
  updateProfile(id: string, profile: Partial<BusinessProfileInput>, scope: RepositoryScope): Promise<Business>;
}
