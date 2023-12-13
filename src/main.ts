import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1'); // set global prefix
  app.enableCors(); // enable cors

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true, // Error if contains properties not in DTO
      whitelist: true, // Clean properties not in DTO
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
