import { ValidationError } from './domain-error';

export class Currency {
  private constructor(private readonly value: string) {}

  static create(value: string): Currency {
    const normalized = value.trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(normalized)) {
      throw new ValidationError('Invalid currency.');
    }

    return new Currency(normalized);
  }

  valueOf(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
