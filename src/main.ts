import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Interceptor to format outgoing responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // cookie-session middleware
  app.use(
    cookieSession({
      keys: [`gh#21dchgu567sc`],
    }),
  );
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
