import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const phase1ValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors) => new BadRequestException({
    code: 'VALIDATION_ERROR',
    message: 'Request validation failed.',
    details: errors.map((error) => ({ property: error.property, constraints: error.constraints })),
  }),
});
