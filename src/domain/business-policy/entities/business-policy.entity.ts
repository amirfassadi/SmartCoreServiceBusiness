import { ValidationError } from '../../shared/domain-error';

export interface BusinessPolicyInput {
  businessId: string;
  policyKey: string;
  policyValueJson: Record<string, unknown> | null;
  version?: number;
}

export class BusinessPolicy {
  readonly id: string;
  readonly businessId: string;
  readonly policyKey: string;
  policyValueJson: Record<string, unknown> | null;
  readonly version: number;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(input: {
    id?: string;
    businessId: string;
    policyKey: string;
    policyValueJson: Record<string, unknown> | null;
    version: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = input.id ?? `policy-${Math.random().toString(36).slice(2, 11)}`;
    this.businessId = input.businessId;
    this.policyKey = input.policyKey.trim();
    if (!this.policyKey || !/^[a-z0-9]+(?:\.[a-z0-9]+)*$/.test(this.policyKey)) {
      throw new ValidationError('Invalid policy key.');
    }
    this.policyValueJson = input.policyValueJson;
    if (this.policyValueJson === null) {
      throw new ValidationError('Policy value JSON is required.');
    }
    if (!this.isValidJsonShape(this.policyValueJson)) {
      throw new ValidationError('Policy value must be valid JSON object content.');
    }
    this.version = input.version;
    if (this.version < 1) throw new ValidationError('Policy version must be >= 1.');
    this.createdAt = input.createdAt ?? new Date();
    this.updatedAt = input.updatedAt ?? this.createdAt;
  }

  private isValidJsonShape(value: Record<string, unknown> | null): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  static create(input: BusinessPolicyInput): BusinessPolicy {
    return new BusinessPolicy({
      businessId: input.businessId,
      policyKey: input.policyKey,
      policyValueJson: input.policyValueJson,
      version: input.version ?? 1,
    });
  }

  createNextVersion(newValue: Record<string, unknown>): BusinessPolicy {
    if (!this.isValidJsonShape(newValue)) {
      throw new ValidationError('Policy value must be valid JSON object content.');
    }
    return new BusinessPolicy({
      businessId: this.businessId,
      policyKey: this.policyKey,
      policyValueJson: newValue,
      version: this.version + 1,
    });
  }
}
