import { ValidationError } from './domain-error';

export class Locale {
  private constructor(private readonly value: string) {}

  static create(value: string): Locale {
    const normalized = value.trim();
    const pattern = /^[a-z]{2,3}(-[A-Z0-9]{2,8})?$/;
    if (!pattern.test(normalized)) {
      throw new ValidationError('Invalid locale.');
    }

    return new Locale(normalized);
  }

  static isValid(value: string): boolean {
    try {
      Locale.create(value);
      return true;
    } catch {
      return false;
    }
  }

  valueOf(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
