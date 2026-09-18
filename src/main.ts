import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './presentation/http/app.module';
import { HttpErrorFilter } from './presentation/http/http-error.filter';
import { phase1ValidationPipe } from './presentation/http/validation.pipe';

export async function createHttpApplication() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(phase1ValidationPipe);
  app.useGlobalFilters(new HttpErrorFilter());
  return app;
}

async function bootstrap(): Promise<void> {
  const app = await createHttpApplication();
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

if (typeof require !== 'undefined' && require.main === module) {
  void bootstrap();
}
