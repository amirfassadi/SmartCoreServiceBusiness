import { ValidationError } from '../../shared/domain-error';

export class ServiceDuration {
  private constructor(private readonly value: number) {}

  static create(value: number): ServiceDuration {
    if (!Number.isInteger(value) || value <= 0) {
      throw new ValidationError('Invalid service duration.');
    }

    return new ServiceDuration(value);
  }

  valueOf(): number {
    return this.value;
  }

  toString(): string {
    return `${this.value}`;
  }
}
