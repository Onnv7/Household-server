import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CategoryEntity } from '../entity/category/category.entity';

@Injectable()
export class CategoryRepository extends Repository<CategoryEntity> {
  constructor(private dataSource: DataSource) {
    super(CategoryEntity, dataSource.createEntityManager());
  }

  async find() {
    return await super.find();
  }
}
