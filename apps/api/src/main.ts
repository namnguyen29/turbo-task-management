import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createValidationException } from './common/errors/validation-error';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: createValidationException,
    }),
  );
  await app.listen(process.env.PORT ?? 4300);
}

bootstrap()
  .then(() => {
    console.log(`Application is running on PORT ${process.env.PORT ?? 4300}`);
  })
  .catch((error) => {
    console.error('Application failed to start:', error);
    process.exit(1);
  });
