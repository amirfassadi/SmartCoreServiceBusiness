import { ValidationError } from '../../shared/domain-error';
import { Slug } from '../../shared/slug.value-object';
import { ServiceDuration } from '../value-objects/service-duration.value-object';
import { v4 as uuid } from 'uuid';

export interface ServiceInput {
  businessId: string;
  categoryId: string;
  name: string;
  slug: string;
  durationMinutes: number;
}

export class Service {
  readonly id: string;
  readonly businessId: string;
  readonly categoryId: string;
  name: string;
  slug: string;
  durationMinutes: number;
  archivedAt: Date | null;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(input: {
    id?: string;
    businessId: string;
    categoryId: string;
    name: string;
    slug: string;
    durationMinutes: number;
    archivedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = input.id ?? uuid();
    this.businessId = input.businessId;
    this.categoryId = input.categoryId;
    this.name = input.name.trim();
    if (!this.name) throw new ValidationError('Service name is required.');
    this.slug = Slug.create(input.slug).toString();
    this.durationMinutes = ServiceDuration.create(input.durationMinutes).valueOf();
    this.archivedAt = input.archivedAt ?? null;
    this.createdAt = input.createdAt ?? new Date();
    this.updatedAt = input.updatedAt ?? this.createdAt;
  }

  static create(input: ServiceInput): Service {
    return new Service(input);
  }

}
