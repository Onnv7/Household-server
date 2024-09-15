import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderBillService } from './order-bill.service';
import { BaseController } from '../../BaseController';
import { CreateOrderBillRequest, UpdateOrderBillEventRequest } from './payload/order-bill.request';
import { ResponseAPI } from '../../common/model/response-api';
import { ResponseMessage } from '../../constant/response.constant';
import { ApiQueryURL } from '../../common/decorator/query-swagger.decorator';
import { ApiResponseCustom } from '../../common/decorator/response-swagger.decorator';
import {
  CreateOrderResponse,
  GetOrderBillDetailByIdResponse,
  GetOrderBillPageResponse,
} from './payload/order-bill.response';
import { PageSizeIntPipe } from '../../common/pipe/page-size.pipe';
import { HasAuthorize } from '../../common/decorator/role.decorator';
import { OrderBillEvent, Role } from '../../common/enum';
import { AppContext, AppContextType } from '../../common/decorator/security-context.decorator';
import { createHash } from 'crypto';

@Controller('order-bill')
@ApiTags('ORDER BILL')
export class OrderBillController extends BaseController {
  constructor(private readonly orderBillService: OrderBillService) {
    super();
  }
  @ApiResponseCustom({ status: 200, summary: 'Create a new order bill' })
  @HasAuthorize([Role.ROLE_USER])
  @Post()
  async createOrderBill(@Body() body: CreateOrderBillRequest): Promise<ResponseAPI<CreateOrderResponse>> {
    const data = await this.orderBillService.createOrderBill(body);
    return { data, message: ResponseMessage.CREATE };
  }

  @ApiResponseCustom({ dataType: GetOrderBillDetailByIdResponse, status: 200, summary: 'Get order bill by id' })
  @HasAuthorize([Role.ROLE_USER])
  @Get('/:orderId')
  async getOrderBillDetail(@Param('orderId') orderId: number): Promise<ResponseAPI<GetOrderBillDetailByIdResponse>> {
    const data = await this.orderBillService.getOrderBillDetail(orderId);
    return { data, message: ResponseMessage.GET };
  }

  @ApiResponseCustom({ dataType: GetOrderBillPageResponse, status: 200, summary: "Get order bill page by user's id" })
  @Get('/user/:userId')
  @HasAuthorize([Role.ROLE_USER])
  async getOrderBillPage(
    @Query('page', PageSizeIntPipe) page: number,
    @Query('size', PageSizeIntPipe) size: number,
    @Param('userId') userId: number,
  ): Promise<ResponseAPI<GetOrderBillPageResponse>> {
    const data = await this.orderBillService.getOrderBillPage(page, size, userId);
    return { data, message: ResponseMessage.GET };
  }

  @ApiResponseCustom({ dataType: GetOrderBillPageResponse, status: 200, summary: 'Update order status' })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @Patch('/:id/update-status')
  // @HasAuthorize([Role.ROLE_USER])
  async updateOrderBillStatus(
    @Param('id') id: number,
    @Body() body: UpdateOrderBillEventRequest,
  ): Promise<ResponseAPI<void>> {
    const data = await this.orderBillService.updateOrderBillStatus(id, body);
    return { message: ResponseMessage.GET };
  }

  @Get('/url/asdas')
  async getUrl() {
    const codeVerifier = this.generateCodeVerifier(); // Tạo code_verifier
    console.log('Code Verifier:', codeVerifier);

    const data = this.generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      console.log('Code Challenge:', codeChallenge); // Tạo và log code_challenge
    });
    return { data: data };
  }

  generateCodeVerifier(length: number = 43): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let codeVerifier = '';
    for (let i = 0; i < length; i++) {
      codeVerifier += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return codeVerifier;
  }
  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    // Mã hóa code_verifier thành ASCII
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);

    // Băm bằng SHA-256
    const sha256Hash = await crypto.subtle.digest('SHA-256', data);

    // Chuyển đổi mã băm thành chuỗi Base64 không có padding
    const base64String = btoa(String.fromCharCode(...new Uint8Array(sha256Hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); // Xóa ký tự padding "="

    return base64String;
  }
}
