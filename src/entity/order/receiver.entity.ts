import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { OrderBillEntity } from './order-bill.entity';

@Entity({ name: 'receiver' })
export class ReceiverEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'address', nullable: true })
  address: string;

  @OneToOne(() => OrderBillEntity, (orderBill) => orderBill.receiver)
  @JoinColumn({ name: 'order_bill_id' })
  orderBill: OrderBillEntity;
}
