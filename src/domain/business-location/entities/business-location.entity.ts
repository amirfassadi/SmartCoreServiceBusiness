import { ValidationError } from '../../shared/domain-error';
import { Timezone } from '../../shared/timezone.value-object';

export interface BusinessLocationInput {
  businessId: string;
  name: string;
  address?: string;
  timezone: string;
  active?: boolean;
}

export class BusinessLocation {
  readonly id: string;
  readonly businessId: string;
  name: string;
  address?: string;
  timezone: string;
  active: boolean;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(input: {
    id?: string;
    businessId: string;
    name: string;
    address?: string;
    timezone: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = input.id ?? `location-${Math.random().toString(36).slice(2, 11)}`;
    this.businessId = input.businessId;
    this.name = input.name.trim();
    if (!this.name) throw new ValidationError('Location name is required.');
    this.address = input.address;
    this.timezone = Timezone.create(input.timezone).toString();
    this.active = input.active ?? true;
    this.createdAt = input.createdAt ?? new Date();
    this.updatedAt = input.updatedAt ?? this.createdAt;
  }

  static create(input: BusinessLocationInput): BusinessLocation {
    return new BusinessLocation(input);
  }

  update(input: Partial<Pick<BusinessLocation, 'name' | 'address' | 'timezone'>>): void {
    if (input.name !== undefined) this.name = input.name.trim();
    if (input.address !== undefined) this.address = input.address;
    if (input.timezone !== undefined) this.timezone = Timezone.create(input.timezone).toString();
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.active = false;
    this.updatedAt = new Date();
  }
}
