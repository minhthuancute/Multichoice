/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { HttpErrorFilterr } from './app/http-error-filter';
import configuration from './config/configuration';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpErrorFilterr());
  app.use(json({ limit: '50mb' }));
  const allowedDomains = [
    'https://dev.detracnghiem.vn',
    'https://detracnghiem.vn',
    'http://localhost:4200',
    'http://localhost:3000',
  ];
  console.log(`==> current env: ${process.env.NODE_ENV}`);
  const options = {
    origin: (origin, cb) => {
      if (allowedDomains.includes(origin)) {
        cb(null, origin);
      } else {
        cb(Error('invalid origin'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(process.env.NODE_ENV === "production" ? options :  {
    origin: '*',
  });
  // swagger
  const config = new DocumentBuilder()
    .setTitle('Multichoice')
    .setDescription('Full apis for multichoice project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = configuration().port;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
