import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { DataSeederService } from '../../init/data.init';

@Module({
  controllers: [AddressController],
  providers: [AddressService, DataSeederService],
})
export class AddressModule {}
