import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
