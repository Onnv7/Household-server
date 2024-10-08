import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_sku' })
export class ProductSKUEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sku', unique: true })
  sku: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'price' })
  price: number;

  @ManyToOne(() => ProductEntity, (product) => product.productSKUList, {
    onDelete: 'CASCADE',
    cascade: ['remove'],
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
