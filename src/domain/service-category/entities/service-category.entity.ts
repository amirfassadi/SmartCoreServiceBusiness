import { ValidationError } from '../../shared/domain-error';
import { Slug } from '../../shared/slug.value-object';
import { v4 as uuid } from 'uuid';

export interface ServiceCategoryInput {
  businessId: string;
  name: string;
  slug: string;
  parentCategoryId?: string;
  active?: boolean;
}

export class ServiceCategory {
  readonly id: string;
  readonly businessId: string;
  name: string;
  slug: string;
  parentCategoryId?: string;
  active: boolean;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(input: {
    id?: string;
    businessId: string;
    name: string;
    slug: string;
    parentCategoryId?: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = input.id ?? uuid();
    this.businessId = input.businessId;
    this.name = input.name.trim();
    if (!this.name) throw new ValidationError('Category name is required.');
    this.slug = Slug.create(input.slug).toString();
    this.parentCategoryId = input.parentCategoryId;
    if (this.parentCategoryId && this.parentCategoryId === this.id) {
      throw new ValidationError('Category cannot be its own parent.');
    }
    this.active = input.active ?? true;
    this.createdAt = input.createdAt ?? new Date();
    this.updatedAt = input.updatedAt ?? this.createdAt;
  }

  static create(input: ServiceCategoryInput): ServiceCategory {
    return new ServiceCategory(input);
  }

  setParent(parentCategoryId: string): void {
    if (parentCategoryId === this.id) {
      throw new ValidationError('Category cannot be its own parent.');
    }
    this.parentCategoryId = parentCategoryId;
    this.updatedAt = new Date();
  }
}
