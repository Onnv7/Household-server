import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from '../../../entity/product/product.entity';
import { ProductService } from '../product.service';
import { ProductImageEntity } from '../../../entity/product/product-image.entity';
import { ProductSKUEntity } from '../../../entity/product/product-sku.entity';
import { ProductStatus } from '../../../common/enum';

export class ProductInfo {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  status: ProductStatus;
  @ApiProperty()
  price: number;
  @ApiProperty()
  imageUrl: string;

  static fromProductEntity(entity: ProductEntity): ProductInfo {
    return {
      id: entity.id,
      name: entity.name,
      status: entity.status,
      price: entity.productPrice,
      imageUrl: entity.productImageList[0].imageUrl,
    };
  }
}

export class GetProductList {
  @ApiProperty()
  totalPage: number;
  @ApiProperty()
  productList: ProductInfo[];

  static fromProductEntityList(entityList: ProductEntity[]): ProductInfo[] {
    return entityList.map((entity) => ProductInfo.fromProductEntity(entity));
  }
}

export class GetVisibleProductList {
  @ApiProperty()
  totalPage: number;
  @ApiProperty()
  productList: ProductInfo[];

  static fromProductEntityList(entityList: ProductEntity[]): VisibleProductInfo[] {
    return entityList.map((entity) => VisibleProductInfo.fromProductEntity(entity));
  }
}

export class ProductImage {
  @ApiProperty()
  imageUrl: string;

  static fromProductImageEntity(entity: ProductImageEntity): ProductImage {
    return { imageUrl: entity.imageUrl };
  }
}

export class ProductSKU {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number;

  static fromProductSKUEntity(entity: ProductSKUEntity): ProductSKU {
    return { id: entity.id, name: entity.name, price: entity.price };
  }
}
export class GetProductDetails {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  status: ProductStatus;
  @ApiProperty()
  description: string;
  @ApiProperty()
  productImageList: ProductImage[];
  @ApiProperty()
  productSizeList: ProductSKU[];

  static fromProductEntity(entity: ProductEntity): GetProductDetails {
    return {
      id: entity.id,
      name: entity.name,
      status: entity.status,
      price: entity.price,
      description: entity.description,
      productImageList: entity.productImageList.map((image) => ProductImage.fromProductImageEntity(image)),
      productSizeList: entity.productSKUList.map((size) => ProductSKU.fromProductSKUEntity(size)),
    };
  }
}

export class GetProductVisible1 {
  id: number;
}

export class GetProductVisible {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  summary: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  status: ProductStatus;
  @ApiProperty()
  description: string;
  @ApiProperty()
  productImageList: string[];
  @ApiProperty()
  productSKUList: ProductSKU[];

  static fromProductEntity(entity: ProductEntity): GetProductVisible {
    return {
      id: entity.id,
      name: entity.name,
      summary: entity.summary,
      status: entity.status,
      price: entity.price,
      description: entity.description,
      productImageList: entity.productImageList.map((image) => image.imageUrl),
      productSKUList: entity.productSKUList.map((size) => ProductSKU.fromProductSKUEntity(size)),
    };
  }
}

export class VisibleProductInfo {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  status: ProductStatus;
  @ApiProperty()
  price: number;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty()
  categoryName: string;

  static fromProductEntity(entity: ProductEntity): VisibleProductInfo {
    return {
      id: entity.id,
      name: entity.name,
      status: entity.status,
      price: entity.productPrice,
      imageUrl: entity.productImageList[0].imageUrl,
      categoryName: entity.category.name,
    };
  }
}

export class GetProductVisibleListByCategory {
  @ApiProperty()
  totalPage: number;
  @ApiProperty()
  productList: ProductInfo[];

  static fromProductEntityList(entityList: ProductEntity[]): ProductInfo[] {
    return entityList.map((entity) => ProductInfo.fromProductEntity(entity));
  }
}
