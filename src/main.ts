import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import {
  CustomExceptionHandlerFilter,
  ExceptionHandlerFilter,
} from './common/filter/exception.filter';
import { JwtGuard } from './common/guard/jwt.guard';
import { RoleGuard } from './common/guard/role.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  // setup validate pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  // apply theo thu tu tu duoi len tren -> cha o đầu, con ở sau
  const filters = [
    new ExceptionHandlerFilter(),
    new CustomExceptionHandlerFilter(),
  ];
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
      'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
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
