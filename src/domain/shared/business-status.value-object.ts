import { ValidationError } from './domain-error';

export type BusinessStatusValue = 'draft' | 'active' | 'suspended' | 'archived';

export class BusinessStatus {
  private constructor(private readonly value: BusinessStatusValue) {}

  static values(): BusinessStatusValue[] {
    return ['draft', 'active', 'suspended', 'archived'];
  }

  static draft(): BusinessStatus {
    return new BusinessStatus('draft');
  }

  static create(value: string): BusinessStatus {
    const normalized = value.trim().toLowerCase();
    if (!BusinessStatus.values().includes(normalized as BusinessStatusValue)) {
      throw new ValidationError('Invalid business status.');
    }

    return new BusinessStatus(normalized as BusinessStatusValue);
  }

  static active(): BusinessStatus {
    return new BusinessStatus('active');
  }

  static suspended(): BusinessStatus {
    return new BusinessStatus('suspended');
  }

  static archived(): BusinessStatus {
    return new BusinessStatus('archived');
  }

  valueOf(): BusinessStatusValue {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: BusinessStatus): boolean {
    return this.value === other.valueOf();
  }
}
