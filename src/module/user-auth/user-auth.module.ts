import { Module, forwardRef } from '@nestjs/common';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entity/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AppModule } from '../../app.module';
import { ZaloAuthService } from '../../service/zalo-social/zalo-auth.service';

@Module({
  controllers: [UserAuthController],
  providers: [UserAuthService, ZaloAuthService],
})
export class UserAuthModule {}
