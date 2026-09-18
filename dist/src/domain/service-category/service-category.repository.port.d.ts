import { ServiceCategory } from './entities/service-category.entity';
import { RepositoryScope } from '../../shared/context/request-context';
export type CreateServiceCategoryInput = {
    businessId: string;
    name: string;
    slug: string;
    parentCategoryId?: string;
    active?: boolean;
};
export interface ServiceCategoryRepositoryPort {
    create(input: CreateServiceCategoryInput, scope: RepositoryScope & {
        businessId: string;
    }): Promise<ServiceCategory>;
    getById(id: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<ServiceCategory | null>;
    listByBusiness(scope: RepositoryScope & {
        businessId: string;
    }): Promise<ServiceCategory[]>;
    getBySlug(slug: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<ServiceCategory | null>;
    validateParentOwnership(parentCategoryId: string, scope: RepositoryScope & {
        businessId: string;
    }): Promise<boolean>;
}
