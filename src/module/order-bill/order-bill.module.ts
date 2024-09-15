import { Module } from '@nestjs/common';
import { OrderBillService } from './order-bill.service';
import { OrderBillController } from './order-bill.controller';

@Module({
  controllers: [OrderBillController],
  providers: [OrderBillService],
})
export class OrderBillModule {}
