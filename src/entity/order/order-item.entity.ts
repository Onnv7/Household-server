import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderBillEntity } from './order-bill.entity';

@Entity({ name: 'order_item' })
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ name: 'sku_id', nullable: true })
  skuId: number;

  @Column({ name: 'sku_name', nullable: true })
  skuName: string;

  @Column({ name: 'note', nullable: true })
  note: string;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'thumbnail_url' })
  thumbnailUrl: string;

  @Column({ name: 'price' })
  price: number;

  @ManyToOne(() => OrderBillEntity, (orderBill) => orderBill.orderItemList)
  @JoinColumn({ name: 'order_bill_id' })
  orderBill: OrderBillEntity;
}
