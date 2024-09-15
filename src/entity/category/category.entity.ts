import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CategoryStatus, ProductStatus } from '../../common/enum';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'category' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'name', unique: true })
  name: string;

  @Column({ name: 'status', type: 'enum', enum: CategoryStatus })
  status: CategoryStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => ProductEntity, (product) => product.category, { lazy: true })
  productList: Promise<ProductEntity[]>;
}
