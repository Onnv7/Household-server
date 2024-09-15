import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { OrderBillStatus, OrderType, Role } from '../../common/enum';
import { UserEntity } from '../user.entity';
import { OrderItemEntity } from './order-item.entity';
import { ReceiverEntity } from './receiver.entity';
import { OrderEventEntity } from './order-event.entity';

@Entity({ name: 'order_bill' })
export class OrderBillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.orderBillList, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'total_order' })
  totalOrder: number;

  @Column({ name: 'type', type: 'enum', enum: OrderType })
  type: OrderType;

  @Column({ name: 'note', nullable: true })
  note: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  // =================================================================

  @OneToMany(() => OrderEventEntity, (orderEvent) => orderEvent.orderBill, { eager: true, cascade: ['insert'] })
  orderEventList: OrderEventEntity[];

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.orderBill, { eager: true, cascade: ['insert'] })
  orderItemList: OrderItemEntity[];

  @OneToOne(() => ReceiverEntity, (receiver) => receiver.orderBill, { eager: true, cascade: ['insert'] })
  receiver: ReceiverEntity;
}
