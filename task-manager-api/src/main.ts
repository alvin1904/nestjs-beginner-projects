import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Task Manager')
    .setDescription('The task manager API description')
    .setVersion('1.0')
    .addTag('REST')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 👈 enables class-transformer to actually transform payloads into DTO instances
      transformOptions: {
        enableImplicitConversion: true, // allow simple type coercion like strings to numbers, etc.
      },
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // throws an error if unknown props are sent
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
