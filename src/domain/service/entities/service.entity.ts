import { ValidationError } from '../../shared/domain-error';
import { Slug } from '../../shared/slug.value-object';
import { ServiceDuration } from '../value-objects/service-duration.value-object';

export interface ServiceInput {
  businessId: string;
  categoryId: string;
  name: string;
  slug: string;
  durationMinutes: number;
  active?: boolean;
}

export class Service {
  readonly id: string;
  readonly businessId: string;
  readonly categoryId: string;
  name: string;
  slug: string;
  durationMinutes: number;
  active: boolean;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(input: {
    id?: string;
    businessId: string;
    categoryId: string;
    name: string;
    slug: string;
    durationMinutes: number;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = input.id ?? `service-${Math.random().toString(36).slice(2, 11)}`;
    this.businessId = input.businessId;
    this.categoryId = input.categoryId;
    this.name = input.name.trim();
    if (!this.name) throw new ValidationError('Service name is required.');
    this.slug = Slug.create(input.slug).toString();
    this.durationMinutes = ServiceDuration.create(input.durationMinutes).valueOf();
    this.active = input.active ?? true;
    this.createdAt = input.createdAt ?? new Date();
    this.updatedAt = input.updatedAt ?? this.createdAt;
  }

  static create(input: ServiceInput): Service {
    return new Service(input);
  }

  archive(): void {
    this.active = false;
    this.updatedAt = new Date();
  }
}
