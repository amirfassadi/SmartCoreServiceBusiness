import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class IdentifierPipe implements PipeTransform<string> {
    transform(value: string, metadata: ArgumentMetadata): string;
}
