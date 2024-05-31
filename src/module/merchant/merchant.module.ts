import { Module } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantEntity } from '../../entity/merchant.entity';

@Module({
  // imports: [TypeOrmModule.forFeature([MerchantEntity])],
  controllers: [MerchantController],
  providers: [MerchantService],
})
export class MerchantModule {}
