import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from '../../../entity/product/product.entity';
import { ProductInfo, VisibleProductInfo } from '../../product/payload/product.response';
import { OrderBillStatus, OrderType } from '../../../common/enum';
import { Exclude, Expose, Type } from 'class-transformer';

export class CreateOrderResponse {
  @ApiProperty()
  orderBillId: number;
}

export class ItemListResponse {
  @ApiProperty()
  productId: number;
  @ApiProperty()
  skuId?: number;
  @ApiProperty()
  skuName?: string;
  @ApiProperty()
  productName: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  note: string;
}

export class ReceiverResponse {
  @ApiProperty()
  name: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  address?: string;
}

@Expose()
export class OrderEventResponse {
  @Expose()
  @ApiProperty()
  status: OrderBillStatus;

  @Expose()
  @ApiProperty()
  note: OrderBillStatus;

  @ApiProperty()
  createdAt: Date;
}
export class GetOrderBillDetailByIdResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: OrderType;

  @ApiProperty({ type: [OrderEventResponse] })
  orderEventList: OrderEventResponse[];

  @ApiProperty()
  itemList: ItemListResponse[];

  @ApiProperty()
  receiver: ReceiverResponse;

  @ApiProperty()
  totalOrder: number;

  @ApiProperty()
  note: string;

  @ApiProperty()
  createdAt: Date;
}

export class OrderBillItemPage {
  @ApiProperty()
  id: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  totalOrder: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  status: OrderBillStatus;
}
export class GetOrderBillPageResponse {
  @ApiProperty()
  totalPage: number;

  @ApiProperty({ type: [OrderBillItemPage] })
  orderList: OrderBillItemPage[];
}
