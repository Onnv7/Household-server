import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';
import { Transform } from 'stream';
import { OrderBillEvent, OrderType, ProductStatus } from '../../../common/enum';
import { Type } from 'class-transformer';

export class ItemOrder {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  skuId?: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity?: number;

  @ApiProperty({ example: 2 })
  @IsOptional()
  note?: string;
}

export class CustomerOrderInfo {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsNotEmpty()
  name: string;
  @ApiProperty({ example: '013465789' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'Di An - Binh Duong' })
  @IsOptional()
  address: string;
}

export class CreateOrderBillRequest {
  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ type: [ItemOrder] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemOrder)
  itemList: ItemOrder[];

  @ApiProperty({ example: 120000 })
  @IsNotEmpty()
  @IsNumber()
  totalOrder: number;

  @ApiProperty({ example: 'Nothing' })
  @IsOptional()
  note: string;

  @ApiProperty({ example: OrderType.DELIVERY })
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty({ type: CustomerOrderInfo })
  @Type(() => CustomerOrderInfo)
  @IsNotEmptyObject()
  receiver: CustomerOrderInfo;
}

export class UpdateOrderBillEventRequest {
  @ApiProperty({ enum: OrderBillEvent, example: OrderBillEvent.ACCEPT })
  @IsEnum(OrderBillEvent)
  orderEvent: OrderBillEvent;

  @ApiProperty({ example: 'Nothing' })
  @IsOptional()
  note: string;
}
