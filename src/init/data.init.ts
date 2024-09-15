import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entity/category/category.entity';
import * as fs from 'fs';
import { ProductEntity } from '../entity/product/product.entity';
import { ProductImageEntity } from '../entity/product/product-image.entity';
import { ProductSKUEntity } from '../entity/product/product-sku.entity';
import { Level1 } from '../common/model/location.model';
import { UserEntity } from '../entity/user.entity';
import { Gender, Role } from '../common/enum';
import * as bcrypt from 'bcrypt';
import { env } from '../config/env-configuration.config';

@Injectable()
export class DataSeederService implements OnModuleInit {
  private locations: Level1[];
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    await this.seedCategories();
    await this.seedProducts();
    await this.seedUser();
    this.loadData();
  }

  async seedProducts() {
    const filePath = './src/data/product.data.json';
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const productData of data) {
      const productEntity = productData as ProductEntity;

      const imageList = productData.productImageList as string[];
      const productImageEntityList: ProductImageEntity[] = [];
      for (const item of imageList) {
        productImageEntityList.push({
          id: item + '' + productEntity.name + Math.ceil(Math.random() * 10),
          product: productEntity,
          imageUrl: item,
        } as ProductImageEntity);
      }
      productEntity.productImageList = productImageEntityList;

      const skuList = (productData.productSKUList as ProductSKUEntity[]) ?? [];
      const productSKUEntityList: ProductSKUEntity[] = [];

      for (const item of skuList) {
        productSKUEntityList.push({
          sku: item.sku,
          name: item.name,
          price: item.price,
          product: productEntity,
        } as ProductSKUEntity);
      }
      productEntity.productSKUList = productSKUEntityList;

      const existed = await this.productRepository.findOneBy({ name: productEntity.name });

      if (!existed) {
        const category = await this.categoryRepository.findOneBy({ id: Number(productData.category) });

        if (category) {
          productEntity.category = productData.category;
          await this.productRepository.save(productEntity);
        }
      }
    }
    console.log('Database seeded with products !');
  }
  async seedUser() {
    const userExisted = await this.userRepository.findOneBy({ email: 'nva611@gmail.com' });
    if (userExisted) {
      return;
    }
    const user = {
      email: 'nva611@gmail.com',
      password: await bcrypt.hash('112233', env.SALT_PASSWORD),
      firstName: 'An',
      lastName: 'Nguyen',
      role: Role.ROLE_USER,
      gender: Gender.FEMALE,
    };
    await this.userRepository.save(user);
  }
  async seedCategories() {
    const filePath = './src/data/category.data.json';
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const categoryData of data) {
      const existed = await this.categoryRepository.findOneBy({ name: categoryData.name });
      if (!existed) {
        const category = this.categoryRepository.create(categoryData);
        await this.categoryRepository.save(category);
      }
    }
    console.log('Database seeded with categories !');
  }

  private loadData() {
    const filePath = './src/data/location.data.json';
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const dataJson = JSON.parse(fileData);
    this.locations = dataJson.data as Level1[];
  }

  getLocations() {
    return this.locations;
  }
}
