import { Global, Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { UserAuthModule } from './module/user-auth/user-auth.module';
import { UserAuthController } from './module/user-auth/user-auth.controller';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConfigAsync } from './config/jwt.config';
import { GlobalModule } from './module/global/global.module';
import { JwtStrategy } from './common/strategy/jwt.strategy';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtGuard } from './common/guard/jwt.guard';
import { MerchantModule } from './module/merchant/merchant.module';
import { InitService } from './init/app.init';
import { MerchantEntity } from './entity/merchant.entity';
import { UserEntity } from './entity/user.entity';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    JwtModule.registerAsync(jwtConfigAsync),
    UserAuthModule,
    UserModule,
    GlobalModule,
    MerchantModule,
    TypeOrmModule.forFeature([MerchantEntity, UserEntity]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useFactory: (ref) => new JwtGuard(ref),
    //   inject: [Reflector],
    // },
    InitService,
  ],
  exports: [JwtModule, TypeOrmModule],
})
export class AppModule {}
