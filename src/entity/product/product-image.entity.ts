import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { ProductStatus } from '../../common/enum';

import { ProductEntity } from './product.entity';

@Entity({ name: 'product_image' })
export class ProductImageEntity {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @ManyToOne(() => ProductEntity, (product) => product.productImageList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  // =================================================
}
