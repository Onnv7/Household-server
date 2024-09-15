import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ResponseAPI } from '../../common/model/response-api';
import { ResponseMessage } from '../../constant/response.constant';
import { CreateCategory, UpdateCategory } from './payload/category.request';
import { Role } from '../../common/enum';
import { HasAuthorize } from '../../common/decorator/role.decorator';
import { ApiResponseCustom } from '../../common/decorator/response-swagger.decorator';
import { ApiQueryURL } from '../../common/decorator/query-swagger.decorator';
import { PageSizeIntPipe } from '../../common/pipe/page-size.pipe';
import { GetCategoryPage, GetCategoryVisibleList } from './payload/category.response';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../BaseController';

@ApiTags('CATEGORY')
@Controller('category')
export class CategoryController extends BaseController {
  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  @ApiResponseCustom({ summary: 'Create a new category', status: 201 })
  @HasAuthorize([Role.ROLE_ADMIN])
  @Post()
  async createCategory(@Body() body: CreateCategory): Promise<ResponseAPI> {
    await this.categoryService.createCategory(body);
    return { message: ResponseMessage.CREATE };
  }

  @ApiResponseCustom({ summary: 'Update a category', status: 200 })
  @HasAuthorize([Role.ROLE_ADMIN])
  @Put('/:categoryId')
  async updateCategory(@Param('categoryId') id: number, @Body() body: UpdateCategory): Promise<ResponseAPI> {
    await this.categoryService.updateCategory(id, body);
    return { message: ResponseMessage.UPDATE };
  }

  @ApiResponseCustom({ summary: 'Delete a category', status: 200 })
  @HasAuthorize([Role.ROLE_ADMIN])
  @Delete('/:categoryId')
  async deleteCategory(@Param('categoryId') id: number): Promise<ResponseAPI> {
    await this.categoryService.deleteCategory(id);
    return { message: ResponseMessage.DELETE };
  }

  @ApiResponseCustom({ dataType: GetCategoryPage, summary: 'Get category list', status: 200 })
  @ApiQueryURL([
    { name: 'page', example: 1 },
    { name: 'size', example: 10 },
  ])
  @HasAuthorize([Role.ROLE_ADMIN])
  @Get()
  async getCategoryList(
    @Query('page', PageSizeIntPipe) page: number,
    @Query('size', PageSizeIntPipe) size: number,
  ): Promise<ResponseAPI<GetCategoryPage>> {
    const data = await this.categoryService.getCategoryPage(page, size);
    return { data: data, message: ResponseMessage.GET };
  }

  @ApiResponseCustom({ dataType: GetCategoryVisibleList, summary: 'Get category visible list', status: 200 })
  @Get('visible')
  async getCategoryVisibleList(): Promise<ResponseAPI<GetCategoryVisibleList>> {
    const data = await this.categoryService.getCategoryVisibleList();
    return { data: data, message: ResponseMessage.GET };
  }
}
