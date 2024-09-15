import { Controller, Get, Param } from '@nestjs/common';
import { AddressService } from './address.service';
import { ResponseAPI } from '../../common/model/response-api';
import { GetDistrictListResponse, GetProvinceListResponse, GetWardListResponse } from './payload/address.response';
import { ResponseMessage } from '../../constant/response.constant';
import { ApiResponseCustom } from '../../common/decorator/response-swagger.decorator';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../BaseController';

@ApiTags('ADDRESS')
@Controller('address')
export class AddressController extends BaseController {
  constructor(private readonly addressService: AddressService) {
    super();
  }

  @ApiResponseCustom({ dataType: GetProvinceListResponse, summary: 'Get province list', status: 200 })
  @Get('/province')
  getProvinceList(): ResponseAPI<GetProvinceListResponse> {
    return { data: this.addressService.getProvinceList(), message: ResponseMessage.GET };
  }
  @ApiResponseCustom({ dataType: GetDistrictListResponse, summary: 'Get province list', status: 200 })
  @Get('/province/:provinceId')
  getDistrictList(@Param('provinceId') provinceId: string): ResponseAPI<GetDistrictListResponse> {
    return { data: this.addressService.getDistrictList(provinceId), message: ResponseMessage.GET };
  }

  @ApiResponseCustom({ dataType: GetDistrictListResponse, summary: 'Get province list', status: 200 })
  @Get('/province/:provinceId/district/:districtId')
  getWardList(
    @Param('provinceId') provinceId: string,
    @Param('districtId') districtId: string,
  ): ResponseAPI<GetWardListResponse> {
    return { data: this.addressService.getWardList(provinceId, districtId), message: ResponseMessage.GET };
  }
}
