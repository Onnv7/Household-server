import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateProductRequest } from './payload/product.request';
import { CloudinaryService } from '../../service/cloudinary.service';
import { CloudinaryConstant } from '../../constant/cloudinary.constant';
import { AppError } from '../../common/model/response-api';
import { ErrorResponseData } from '../../constant/response.constant';
import { ProductImageEntity } from '../../entity/product/product-image.entity';
import { ProductEntity } from '../../entity/product/product.entity';
import { CategoryRepository } from '../../repository/category.repository';
import { ProductRepository } from '../../repository/product.repository';
import { ProductSKUEntity } from '../../entity/product/product-sku.entity';
import {
  GetProductDetails,
  GetProductList,
  GetProductVisible,
  GetVisibleProductList,
  GetProductVisibleListByCategory,
} from './payload/product.response';
import { paginate } from 'nestjs-typeorm-paginate';
import { FindManyOptions, Like, Not, Transaction } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { OrderType, ProductStatus, SortType } from '../../common/enum';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  static getMinPrice(priceList: number[]): number {
    return Math.min(...priceList);
  }
  async createProduct(body: CreateProductRequest): Promise<void> {
    let product = new ProductEntity();
    this.logger.debug(body.productSizeList);
    if (body.productSizeList) {
      let productPrice = ProductService.getMinPrice(body.productSizeList.map((size) => size.price));
      product.price = productPrice;
    } else {
      if (!body.price) {
        throw new AppError(ErrorResponseData.DATA_SEND_INVALID);
      }
      product.price = body.price;
    }

    const categoryEntity = await this.categoryRepository.findOneBy({ id: body.categoryId }).then((category) => {
      if (category) {
        return category;
      }
      throw new AppError(ErrorResponseData.CATEGORY_NOT_FOUND);
    });

    product.category = categoryEntity;
    product.name = body.name;
    product.description = body.description;
    product.status = body.status;
    product.productSKUList = body.productSizeList as ProductSKUEntity[];

    try {
      for (const image of body.imageList) {
        const imageUploaded = await this.cloudinaryService.uploadFile(image, CloudinaryConstant.PRODUCT_PATH);
        const productImage: ProductImageEntity = {
          id: imageUploaded.public_id,
          imageUrl: imageUploaded.url,
          product: product,
        };
        product.productImageList = [...(product.productImageList ?? []), productImage];
      }
    } catch (err) {
      throw new AppError(ErrorResponseData.CLOUDINARY_ERROR);
    }
    await this.productRepository.save(product);
  }

  async getProductList(page: number, size: number, key: string): Promise<GetProductList> {
    let options: FindManyOptions<ProductEntity> = { order: { id: 'ASC' } };

    if (key) {
      options = {
        ...options,
        where: [{ name: Like(`%${key}%`) }, { description: Like(`%${key}%`) }],
      };
    }
    const data = await paginate<ProductEntity>(this.productRepository, { page: page, limit: size }, options);

    return {
      totalPage: data.meta.totalPages,
      productList: GetProductList.fromProductEntityList(data.items),
    };
  }

  async getVisibleProductList(
    page: number,
    size: number,
    key?: string,
    sort?: SortType,
    categoryId?: number,
  ): Promise<GetVisibleProductList> {
    let options: FindManyOptions<ProductEntity> = {
      order:
        sort && sort === SortType.ASC_PRICE
          ? { price: 'ASC' }
          : sort === SortType.DESC_PRICE
            ? { price: 'DESC' }
            : sort === SortType.ASC_ALPHABETICAL
              ? { name: 'ASC' }
              : { name: 'DESC' },
      // : { price: 'DESC' },
    };
    if (key) {
      options = {
        ...options,
        where: [{ name: Like(`%${key}%`) }, { description: Like(`%${key}%`) }],
      };
    } else if (categoryId) {
      options = {
        ...options,
        where: { category: { id: categoryId } },
      };
    } else {
      options = {
        ...options,
      };
    }
    const data = await paginate<ProductEntity>(this.productRepository, { page: page, limit: size }, options);

    return {
      totalPage: data.meta.totalPages,
      productList: GetVisibleProductList.fromProductEntityList(data.items),
    };
  }

  async getProductDetails(productId: number): Promise<GetProductDetails> {
    const data = await this.productRepository.findOneBy({ id: productId });
    return GetProductDetails.fromProductEntity(data);
  }

  async getProductVisible(productId: number): Promise<GetProductVisible> {
    const data = await this.productRepository
      .findOne({ where: { id: productId, status: Not(ProductStatus.HIDDEN) } })
      .then((product) => {
        if (!product) throw new AppError(ErrorResponseData.PRODUCT_NOT_FOUND);
        return product;
      });

    return GetProductVisible.fromProductEntity(data);
  }
  async getProductVisibleListByCategory(
    categoryId: number,
    page: number,
    size: number,
  ): Promise<GetProductVisibleListByCategory> {
    const dataPage = await this.productRepository.getProductVisiblePageByCategory(categoryId, page, size);
    return {
      totalPage: dataPage.meta.totalItems,
      productList: GetProductVisibleListByCategory.fromProductEntityList(dataPage.items),
    };
  }

  @Transactional()
  async deleteProduct(productId: number): Promise<void> {
    const data = await this.productRepository.findOneBy({ id: productId });
    await this.productRepository.remove(data);
    const imageList = data.productImageList;
    for (const image of imageList) {
      await this.cloudinaryService.deleteFileFromPublicId(image.id);
    }
  }
}
