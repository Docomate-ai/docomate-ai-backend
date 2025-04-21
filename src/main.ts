import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Interceptor to format outgoing responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Addind validation pipes
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      secret: 'gh#21dchgu567sc',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'none',
        secure: true, // true in production w/ HTTPS
      },
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://docomate-ai.github.io/docomate-ai-frontend',
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 7070);
}
bootstrap();
