import { Global, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { UserAuthModule } from './module/user-auth/user-auth.module';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigAsync } from './config/jwt.config';
import { JwtStrategy } from './common/strategy/jwt.strategy';
import { MerchantModule } from './module/merchant/merchant.module';
import { InitService } from './init/app.init';
import { MerchantEntity } from './entity/merchant.entity';
import { UserEntity } from './entity/user.entity';
import { ProductModule } from './module/product/product.module';
import { CategoryModule } from './module/category/category.module';
import { UserRepository } from './repository/user.repository';
import { CloudinaryProvider } from './config/cloudinary-provider.config';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { CloudinaryService } from './service/cloudinary.service';
import { ProductEntity } from './entity/product/product.entity';
import { ProductImageEntity } from './entity/product/product-image.entity';
import { CategoryEntity } from './entity/category/category.entity';
import { CategoryRepository } from './repository/category.repository';
import { ProductSKUEntity } from './entity/product/product-sku.entity';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { ProductRepository } from './repository/product.repository';
import { OrderBillController } from './module/order-bill/order-bill.controller';
import { OrderBillModule } from './module/order-bill/order-bill.module';
import { DataSeederService } from './init/data.init';
import { OrderBillEntity } from './entity/order/order-bill.entity';
import { OrderItemEntity } from './entity/order/order-item.entity';
import { AddressService } from './module/address/address.service';
import { AddressController } from './module/address/address.controller';
import { AddressModule } from './module/address/address.module';
import { OrderBillRepository } from './repository/order-bill.repository';
import { ReceiverEntity } from './entity/order/receiver.entity';
import { MailerModule } from '@nest-modules/mailer';
import { mailerAsyncOptions } from './config/mailer.config';
import { EmailVerificationEntity } from './entity/email-verification.entity';
import { MailVerificationRepository } from './repository/mail-verification.repository';
import { OrderEventEntity } from './entity/order/order-event.entity';
import { OrderEventRepository } from './repository/order-event.repository';
import { AuthContextService } from './service/auth-context.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import RedisConfig from './config/redis.config';
import { TokenAuthService } from './service/token-auth/token-auth.service';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { env } from './config/env-configuration.config';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheConfig } from './config/cache.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProductSubscriber } from './entity/subcriber/product.subcriber';
const entityList = [
  MerchantEntity,
  UserEntity,
  ProductEntity,
  ProductImageEntity,
  CategoryEntity,
  ProductSKUEntity,
  OrderBillEntity,
  OrderItemEntity,
  ReceiverEntity,
  EmailVerificationEntity,
  OrderEventEntity,
];

const repositoryList = [
  UserRepository,
  CategoryRepository,
  ProductRepository,
  OrderBillRepository,
  MailVerificationRepository,
  OrderEventRepository,
];
@Global()
@Module({
  imports: [
    RedisModule.forRootAsync(RedisConfig.redisAsyncOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    JwtModule.registerAsync(jwtConfigAsync),
    TypeOrmModule.forFeature(entityList),
    MailerModule.forRootAsync(mailerAsyncOptions),
    CacheModule.registerAsync(CacheConfig.getCacheConfigAsync()),
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
    UserAuthModule,
    UserModule,
    MerchantModule,
    ProductModule,
    CategoryModule,
    OrderBillModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    InitService,
    ...repositoryList,
    CloudinaryProvider,
    CloudinaryService,
    DataSeederService,
    AddressService,
    AuthContextService,
    TokenAuthService,
    ProductSubscriber,
  ],
  exports: [
    JwtModule,
    TypeOrmModule,
    NestjsFormDataModule,
    ...repositoryList,
    CloudinaryProvider,
    CloudinaryService,
    DataSeederService,
    AuthContextService,
    TokenAuthService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
