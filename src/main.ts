import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './common/guards/jwt.auth.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
// import { RolesGuard } from './common/guards/roles.guard';
import cookieParser = require('cookie-parser');
import * as express from 'express';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
// import { PermissionsGuard } from './common/guards/permission.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.use(cookieParser());
  // Cần phải xác thực token mới cho phép truy cập vào các api khác
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // new RolesGuard(reflector),
  // new PermissionsGuard(reflector),

  app.use(express.json()); // Giải mã JSON
  app.use(express.urlencoded({ extended: true })); // Giải mã x-www-form-urlencoded
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  const configService = app.get(ConfigService);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  await app.listen(configService.get<string>('PORT'));
  console.log(
    `Application is running on: ${configService.get<string>('BASE_URL')}${configService.get<string>('PORT')}`,
  );
}
bootstrap();
declare const module: any;
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => process.exit(0));
}
