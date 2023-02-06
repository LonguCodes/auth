/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import '@longucodes/promise';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';
import { AdminGuard } from './admin/application/guard/admin.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalGuards(await app.resolve(AdminGuard));
  app.useGlobalPipes(new ValidationPipe({ enableDebugMessages: true }));
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Authentication api')
    .setDescription('Microservice for unified authentication')
    .setVersion(version)
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

void bootstrap();
