import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseAPI } from '../../common/model/response-api';
import { ResponseMessage } from '../../constant/response.constant';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateProductRequest } from './payload/product.request';
import { ApiResponseCustom } from '../../common/decorator/response-swagger.decorator';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { HasAuthorize } from '../../common/decorator/role.decorator';
import { Role, SortType } from '../../common/enum';
import {
  GetProductDetails,
  GetProductList,
  GetProductVisible,
  GetVisibleProductList,
  GetProductVisibleListByCategory,
} from './payload/product.response';
import { ApiQueryURL } from '../../common/decorator/query-swagger.decorator';
import { BaseController } from '../../BaseController';

@ApiTags('PRODUCT')
@Controller('product')
export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super();
  }

  @ApiResponseCustom({
    dataType: null,
    status: 201,
    summary: 'Create a new product',
  })
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: MemoryStoredFile })
  @Post()
  @HasAuthorize([Role.ROLE_ADMIN])
  async createProduct(@Body() body: CreateProductRequest): Promise<ResponseAPI<void>> {
    await this.productService.createProduct(body);
    return { message: ResponseMessage.CREATE };
  }

  @ApiResponseCustom({ dataType: GetProductList, status: 200, summary: 'Get product list' })
  @ApiQueryURL([
    { name: 'page', example: 1 },
    { name: 'size', example: 10 },
    { name: 'key', example: 'senko' },
  ])
  @Get()
  @HasAuthorize([Role.ROLE_ADMIN])
  async getProductList(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('key') key: string,
  ): Promise<ResponseAPI<GetProductList>> {
    const data = await this.productService.getProductList(page, size, key);
    return { data: data, message: ResponseMessage.GET };
  }

  @ApiResponseCustom({ dataType: GetVisibleProductList, status: 200, summary: 'Get product visible list' })
  @ApiQueryURL([
    { name: 'page', example: 1 },
    { name: 'size', example: 10 },
    { name: 'key', example: 'senko' },
    { name: 'category', example: 1 },
    { name: 'sort', enum: SortType },
  ])
  @Get('visible')
  async getProductVisibleList(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('key') key?: string,
    @Query('category') categoryId?: number,
    @Query('sort') sort?: SortType,
  ): Promise<ResponseAPI<GetVisibleProductList>> {
    const data = await this.productService.getVisibleProductList(page, size, key, sort, categoryId);
    return { data: data, message: ResponseMessage.GET };
  }

  @ApiResponseCustom({ dataType: GetProductDetails, status: 200, summary: 'Get product details by id' })
  @Get(':productId/details')
  @HasAuthorize([Role.ROLE_ADMIN])
  async getProductDetails(@Param('productId') productId: number): Promise<ResponseAPI<GetProductDetails>> {
    const data = await this.productService.getProductDetails(productId);
    return { data: data, message: ResponseMessage.GET };
  }

  @ApiResponseCustom({ status: 200, summary: 'Delete product by id' })
  @Delete(':productId')
  @HasAuthorize([Role.ROLE_ADMIN])
  async deleteProduct(@Param('productId') productId: number): Promise<ResponseAPI<void>> {
    await this.productService.deleteProduct(productId);
    return { message: ResponseMessage.DELETE };
  }

  @ApiResponseCustom({ dataType: GetProductVisible, status: 200, summary: 'Get product visible by id' })
  @Get(':productId/visible')
  async getProductVisible(@Param('productId') productId: number): Promise<ResponseAPI<GetProductVisible>> {
    const data = await this.productService.getProductVisible(productId);
    return { data: data, message: ResponseMessage.GET };
  }

  @ApiResponseCustom({ dataType: GetProductVisible, status: 200, summary: 'Get product visible by id' })
  @ApiQueryURL([
    { name: 'page', example: 1 },
    { name: 'size', example: 10 },
  ])
  @Get('category/:categoryId')
  async getProductVisibleListByCategory(
    @Query('page') page: number,
    @Query('size') size: number,
    @Param('categoryId') categoryId: number,
  ): Promise<ResponseAPI<GetProductVisibleListByCategory>> {
    const data = await this.productService.getProductVisibleListByCategory(categoryId, page, size);
    return { data: data, message: ResponseMessage.GET };
  }
}
