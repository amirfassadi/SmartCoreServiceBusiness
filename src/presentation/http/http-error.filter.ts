import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../../domain/shared/domain-error';

const statusByCode: Record<string, number> = {
  VALIDATION_ERROR: HttpStatus.BAD_REQUEST,
  INVALID_LOCALE: HttpStatus.BAD_REQUEST,
  INVALID_TIMEZONE: HttpStatus.BAD_REQUEST,
  INVALID_CURRENCY: HttpStatus.BAD_REQUEST,
  INVALID_SERVICE_DURATION: HttpStatus.BAD_REQUEST,
  INVALID_POLICY: HttpStatus.BAD_REQUEST,
  BUSINESS_ACCESS_DENIED: HttpStatus.FORBIDDEN,
  CROSS_BUSINESS_REFERENCE: HttpStatus.FORBIDDEN,
  BUSINESS_NOT_FOUND: HttpStatus.NOT_FOUND,
  PROFILE_NOT_FOUND: HttpStatus.NOT_FOUND,
  LOCATION_NOT_FOUND: HttpStatus.NOT_FOUND,
  CATEGORY_NOT_FOUND: HttpStatus.NOT_FOUND,
  SERVICE_NOT_FOUND: HttpStatus.NOT_FOUND,
  POLICY_NOT_FOUND: HttpStatus.NOT_FOUND,
  BUSINESS_SLUG_ALREADY_EXISTS: HttpStatus.CONFLICT,
  LOCATION_NAME_ALREADY_EXISTS: HttpStatus.CONFLICT,
  CATEGORY_SLUG_ALREADY_EXISTS: HttpStatus.CONFLICT,
  SERVICE_SLUG_ALREADY_EXISTS: HttpStatus.CONFLICT,
  POLICY_KEY_ALREADY_EXISTS: HttpStatus.CONFLICT,
  POLICY_VERSION_CONFLICT: HttpStatus.CONFLICT,
  INVALID_PARENT_CATEGORY: HttpStatus.UNPROCESSABLE_ENTITY,
  INVALID_SERVICE_CATEGORY: HttpStatus.UNPROCESSABLE_ENTITY,
};

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    if (exception instanceof DomainError) {
      const status = statusByCode[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(status).json({ code: exception.code, message: exception.message, details: {} });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const details = typeof exceptionResponse === 'object' && exceptionResponse !== null && 'details' in exceptionResponse
        ? exceptionResponse.details
        : {};
      response.status(status).json({ code: 'VALIDATION_ERROR', message: 'Request validation failed.', details });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: 'PERSISTENCE_FAILURE', message: 'An internal error occurred.', details: {} });
  }
}
