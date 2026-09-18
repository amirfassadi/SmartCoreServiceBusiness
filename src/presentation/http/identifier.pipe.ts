import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ValidationError } from '../../domain/shared/domain-error';

@Injectable()
export class IdentifierPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    const pattern = metadata.data === 'policyKey' ? /^[a-z0-9]+(?:\.[a-z0-9]+)*$/ : /^[A-Za-z0-9_-]+$/;
    if (!pattern.test(value)) throw new ValidationError('Invalid route identifier.', 'VALIDATION_ERROR');
    return value;
  }
}
