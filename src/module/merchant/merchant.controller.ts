import { Body, Controller, Post } from '@nestjs/common';
import { BaseController } from '../../BaseController';
import { MerchantService } from './merchant.service';
import { ResponseAPI } from '../../common/model/response-api';
import { MerchantLoginRequest } from './payload/merchant-request.payload';
import { ResponseMessage } from '../../constant/response.constant';

@Controller('merchant')
export class MerchantController extends BaseController {
  constructor(private readonly merchantService: MerchantService) {
    super();
  }

  @Post('/login')
  async login(@Body() body: MerchantLoginRequest): Promise<ResponseAPI<any>> {
    const data = await this.merchantService.merchantLogin(body);
    return { data: data, message: ResponseMessage.GET };
  }
}
