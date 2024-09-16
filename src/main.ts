import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { CustomExceptionHandlerFilter, ExceptionHandlerFilter } from './common/filter/exception.filter';
import { JwtGuard } from './common/guard/jwt.guard';
import { RoleGuard } from './common/guard/role.guard';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initializeTransactionalContext } from 'typeorm-transactional';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: true,
  });

  // set cookie
  app.use(cookieParser());

  // set request body
  app.use(bodyParser.urlencoded({ extended: true }));
  // Enable CORS with default settings
  app.enableCors({
    origin: 'http://localhost:3006', // Thay thế bằng domain của bạn
    credentials: true, // Cho phép gửi thông tin xác thực như cookies
  });

  app.setGlobalPrefix('/api');

  // setup validate pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // set interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // apply theo thu tu tu duoi len tren -> cha o đầu, con ở sau
  const filters = [new ExceptionHandlerFilter(), new CustomExceptionHandlerFilter()];
  app.useGlobalFilters(...filters);

  const reflector = app.get(Reflector);
  const guards = [new JwtGuard(), new RoleGuard(reflector)];
  app.useGlobalGuards(...guards);

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('Household API example')
    .setDescription('')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addCookieAuth(
      'refreshToken',
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      },
      'refresh-token',
    )

    .setVersion('1.0')

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // set up server
  await app.listen(8000);
  console.log('swagger api at http://localhost:8000/swagger');
  console.log('server started at http://localhost:8000/');
}
bootstrap();
