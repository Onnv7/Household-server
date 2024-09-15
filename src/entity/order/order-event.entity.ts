import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderBillStatus } from '../../common/enum';
import { OrderBillEntity } from './order-bill.entity';

@Entity({ name: 'order_event' })
export class OrderEventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status', type: 'enum', enum: OrderBillStatus })
  status: OrderBillStatus;

  @Column({ name: 'note', nullable: true })
  note: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => OrderBillEntity, (orderBill) => orderBill.orderEventList)
  @JoinColumn({ name: 'order_bill_id' })
  orderBill: OrderBillEntity;
}
