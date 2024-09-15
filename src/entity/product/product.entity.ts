import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderType, ProductStatus, Role } from '../../common/enum';
import { ProductImageEntity } from './product-image.entity';
import { CategoryEntity } from '../category/category.entity';
import { ProductSKUEntity } from './product-sku.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', unique: true })
  name: string;

  @Column({ name: 'price', nullable: true })
  price: number;

  @Column({ name: 'summary' })
  summary: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'status', type: 'enum', enum: ProductStatus })
  status: ProductStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.productList, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  // =================================================
  @OneToMany(() => ProductImageEntity, (productImage) => productImage.product, {
    cascade: ['insert'],
    eager: true,
  })
  productImageList: ProductImageEntity[];

  @OneToMany(() => ProductSKUEntity, (productSize) => productSize.product, {
    cascade: ['insert'],
    eager: true,
  })
  productSKUList: ProductSKUEntity[];

  @Expose()
  get productPrice(): number {
    return this.price ?? Math.min(...this.productSKUList.map((size) => size.price));
  }
}
