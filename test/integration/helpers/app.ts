import { INestApplication } from '@nestjs/common';

export async function createIntegrationApp(): Promise<INestApplication> {
  const { createHttpApplication } = await import('../../../src/main');
  const app = await createHttpApplication();
  await app.init();
  return app;
}