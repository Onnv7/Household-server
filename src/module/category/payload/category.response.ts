import { ApiProperty } from '@nestjs/swagger';
import { CategoryStatus, ProductStatus } from '../../../common/enum';
import { CategoryEntity } from '../../../entity/category/category.entity';

export class CategoryInfo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: CategoryStatus;

  static fromCategoryEntity(entity: CategoryEntity): CategoryInfo {
    return {
      id: entity.id,
      name: entity.name,
      status: entity.status,
    };
  }
}
export class GetCategoryPage {
  @ApiProperty()
  totalPage: number;

  @ApiProperty()
  categoryList: CategoryInfo[];

  static fromCategoryEntityList(entityList: CategoryEntity[]): CategoryInfo[] {
    return entityList.map((entity) => {
      return CategoryInfo.fromCategoryEntity(entity);
    });
  }
}

export class GetCategoryStringList {}

export class CategoryInfoVisible {
  @ApiProperty()
  id: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  productQuantity: number;

  static async fromCategoryEntity(entity: CategoryEntity): Promise<CategoryInfoVisible> {
    const productList = await entity.productList;
    return {
      id: entity.id,
      name: entity.name,
      imageUrl: entity.imageUrl,
      productQuantity: productList?.map((item) => item.status !== ProductStatus.HIDDEN).length ?? 0,
    };
  }
}
export class GetCategoryVisibleList {
  @ApiProperty()
  categoryList: CategoryInfoVisible[];

  static async fromCategoryEntityList(entityList: CategoryEntity[]): Promise<CategoryInfoVisible[]> {
    const data = [];
    for (const entity of entityList) {
      data.push(await CategoryInfoVisible.fromCategoryEntity(entity));
    }
    return data;
  }
}
