import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalPipes(new ValidationPipe());

  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // strips non-decorated fields
      forbidNonWhitelisted: true,  // throws if extra fields sent
      transform: true,             // converts payloads to DTO instances
    }),
  );
  
  await app.listen(3333);
}
bootstrap();
