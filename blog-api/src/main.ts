import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { AllExceptionFilter } from './common/filters/all-exceptions.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor());

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Blog Api')
    .setDescription('The Blog API description')
    .setVersion('1.0')
    .addTag('REST')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
