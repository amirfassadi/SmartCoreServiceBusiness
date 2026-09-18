"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpApplication = createHttpApplication;
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./presentation/http/app.module");
const http_error_filter_1 = require("./presentation/http/http-error.filter");
const validation_pipe_1 = require("./presentation/http/validation.pipe");
async function createHttpApplication() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(validation_pipe_1.phase1ValidationPipe);
    app.useGlobalFilters(new http_error_filter_1.HttpErrorFilter());
    return app;
}
async function bootstrap() {
    const app = await createHttpApplication();
    await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
if (require.main === module) {
    void bootstrap();
}
