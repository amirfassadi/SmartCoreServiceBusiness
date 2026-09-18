import { ValidationError } from './domain-error';

export class Timezone {
  private constructor(private readonly value: string) {}

  static create(value: string): Timezone {
    const normalized = value.trim();
    if (!normalized || !/^[A-Za-z_]+\/[A-Za-z0-9_\-+]+$/.test(normalized) && !/^[A-Za-z_]+$/.test(normalized)) {
      throw new ValidationError('Invalid timezone.');
    }

    return new Timezone(normalized);
  }

  valueOf(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
