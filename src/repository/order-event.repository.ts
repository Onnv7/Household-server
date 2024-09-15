import { DataSource, Repository } from 'typeorm';
import { OrderEventEntity } from '../entity/order/order-event.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderEventRepository extends Repository<OrderEventEntity> {
  constructor(private dataSource: DataSource) {
    super(OrderEventEntity, dataSource.createEntityManager());
  }
}
