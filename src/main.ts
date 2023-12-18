import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // swagger ------------------------------------------------------------
  const config = new DocumentBuilder()
    .setTitle('Auth - Mongoose and Nest')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  // --------------------------------------------------------------------

  await app.listen(process.env.PORT);
}
bootstrap();
