import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseCustom } from '../../common/decorator/response-swagger.decorator';
import { ResponseAPI } from '../../common/model/response-api';
import { GetUserList, GetUserProfileResponse } from './payload/user.response';
import { ResponseMessage } from '../../constant/response.constant';
import { PageSizeIntPipe } from '../../common/pipe/page-size.pipe';
import { ApiQueryURL } from '../../common/decorator/query-swagger.decorator';
import { UpdateUserProfileRequest } from './payload/user.request';
import { UserEntity } from '../../entity/user.entity';
import { HasAuthorize } from '../../common/decorator/role.decorator';
import { Role } from '../../common/enum';
import { BaseController } from '../../BaseController';

@ApiTags('USER')
@Controller('user')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get()
  @ApiResponseCustom({
    dataType: GetUserList,
    status: 200,
    summary: 'Get user list',
  })
  @ApiQueryURL([
    { name: 'page', example: 1 },
    { name: 'size', example: 10 },
  ])
  async getUserList(
    @Query('page', PageSizeIntPipe) page: number,
    @Query('size', PageSizeIntPipe) size: number,
  ): Promise<ResponseAPI<GetUserList>> {
    const test = UserEntity;
    test.bind;
    const data = await this.userService.getUserList(page, size);
    return { data: data, message: ResponseMessage.GET };
  }

  @ApiResponseCustom({
    status: 200,
    summary: "Update user's profile",
  })
  @Put(':userId')
  async updateProfile(@Body() body: UpdateUserProfileRequest, @Param('userId') userId: number): Promise<ResponseAPI> {
    await this.userService.updateProfile(userId, body);
    return { message: ResponseMessage.UPDATE };
  }

  @ApiResponseCustom({
    status: 200,
    summary: "Get user's profile",
  })
  @HasAuthorize([Role.ROLE_USER])
  @Get('/profile/:userId')
  async getUserProfile(@Param('userId') userId: number): Promise<ResponseAPI<GetUserProfileResponse>> {
    const data = await this.userService.getUserProfile(userId);
    return { data, message: ResponseMessage.GET };
  }
}
