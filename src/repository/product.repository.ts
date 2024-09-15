import { Injectable } from '@nestjs/common';
import { Repository, DataSource, FindOptionsWhere, FindManyOptions, Not } from 'typeorm';
import { CategoryEntity } from '../entity/category/category.entity';
import { ProductEntity } from '../entity/product/product.entity';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ProductStatus } from '../common/enum';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  async getProductVisiblePageByCategory(
    categoryId: number,
    page: number,
    size: number,
  ): Promise<Pagination<ProductEntity>> {
    const options: FindManyOptions<ProductEntity> = {
      where: { category: { id: categoryId }, status: Not(ProductStatus.HIDDEN) },
    };
    const data = await paginate<ProductEntity>(this, { page, limit: size }, options);
    // const data = await this.createQueryBuilder('product')
    //   .where('product.category_id = :categoryId', { categoryId })
    //   .andWhere("product.status != 'HIDDEN'")
    //   .getMany();
    return data;
  }

  async getProductAvailableById(productId: number): Promise<ProductEntity> {
    const product = await this.findOne({
      where: {
        id: productId,
        status: ProductStatus.AVAILABLE,
      },
    });
    return product;
  }
}
