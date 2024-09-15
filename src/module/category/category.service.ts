import { Injectable } from '@nestjs/common';
import { CreateCategory, UpdateCategory } from './payload/category.request';
import { CategoryRepository } from '../../repository/category.repository';
import { AppError, ErrorData } from '../../common/model/response-api';
import { ErrorResponseData } from '../../constant/response.constant';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { UserEntity } from '../../entity/user.entity';
import { CategoryEntity } from '../../entity/category/category.entity';
import { GetCategoryPage, GetCategoryVisibleList } from './payload/category.response';
import { CategoryStatus } from '../../common/enum';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(body: CreateCategory) {
    const category = this.categoryRepository.create(body);
    await this.categoryRepository.save(category);
  }

  async updateCategory(id: number, body: UpdateCategory) {
    const category = await this.categoryRepository.findOneBy({ id: id }).then((category) => {
      if (!category) {
        throw new AppError(ErrorResponseData.CATEGORY_NOT_FOUND);
      }
      return category;
    });

    await this.categoryRepository.save({ ...category, ...body });
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepository.findOneBy({ id: id }).then((category) => {
      if (!category) {
        throw new AppError(ErrorResponseData.CATEGORY_NOT_FOUND);
      }
      return category;
    });

    if (category.productList && (await category.productList).length > 0) {
      throw new AppError(ErrorResponseData.CATEGORY_DELETE);
    }
    await this.categoryRepository.remove(category);
  }

  async getCategoryPage(page: number, size: number): Promise<GetCategoryPage> {
    const data: Pagination<CategoryEntity> = await paginate<CategoryEntity>(this.categoryRepository, {
      page: page,
      limit: size,
    });

    return {
      totalPage: data.meta.totalPages,
      categoryList: GetCategoryPage.fromCategoryEntityList(data.items),
    };
  }

  async getCategoryVisibleList(): Promise<GetCategoryVisibleList> {
    const data = await this.categoryRepository.findBy({ status: CategoryStatus.VISIBLE });
    return { categoryList: await GetCategoryVisibleList.fromCategoryEntityList(data) };
  }
}
