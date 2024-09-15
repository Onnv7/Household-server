import { DataSource, Repository } from 'typeorm';
import { OrderBillEntity } from '../entity/order/order-bill.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderBillRepository extends Repository<OrderBillEntity> {
  constructor(private dataSource: DataSource) {
    super(OrderBillEntity, dataSource.createEntityManager());
  }
}
