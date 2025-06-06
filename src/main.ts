import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Interceptor to format outgoing responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Addind validation pipes
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  // app.enableCors({
  //   origin: [
  //     'http://localhost:5173',
  //     'https://docomate-ai.github.io/docomate-ai-frontend',
  //   ],
  //   credentials: true,
  // });

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://docomate-ai.github.io',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 7070);
}
bootstrap();
