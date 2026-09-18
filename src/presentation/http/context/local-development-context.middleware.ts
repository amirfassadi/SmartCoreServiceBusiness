import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ValidatedExternalContext } from './external-request-context';

interface RequestWithValidatedContext extends Request {
  validatedContext?: ValidatedExternalContext;
}

@Injectable()
export class LocalDevelopmentContextMiddleware implements NestMiddleware {
  use(request: RequestWithValidatedContext, _response: Response, next: NextFunction): void {
    const organizationId = request.header('x-smartcore-test-organization-id');
    const actorId = request.header('x-smartcore-test-actor-id') ?? undefined;

    if (organizationId?.trim()) {
      request.validatedContext = { organizationId: organizationId.trim(), actorId };
    }

    next();
  }
}