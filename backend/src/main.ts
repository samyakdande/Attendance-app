import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for Expo requests
  
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor()
  ); // ERP JSON Envelope & Structured Logging
  
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
