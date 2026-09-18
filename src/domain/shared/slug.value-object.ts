import { ValidationError } from './domain-error';

export class Slug {
  private constructor(private readonly value: string) {}

  static create(value: string): Slug {
    const normalized = value.trim().toLowerCase();
    if (!normalized || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
      throw new ValidationError('Invalid slug.');
    }

    return new Slug(normalized);
  }

  valueOf(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
