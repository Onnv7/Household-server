import { Injectable, Logger } from '@nestjs/common';
import { OrderBillRepository } from '../../repository/order-bill.repository';
import { CreateOrderBillRequest, UpdateOrderBillEventRequest } from './payload/order-bill.request';
import { ProductRepository } from '../../repository/product.repository';
import { AppError } from '../../common/model/response-api';
import { ErrorCode, ErrorResponseData } from '../../constant/response.constant';
import { OrderItemEntity } from '../../entity/order/order-item.entity';
import { ReceiverEntity } from '../../entity/order/receiver.entity';
import { OrderBillEntity } from '../../entity/order/order-bill.entity';
import {
  CreateOrderResponse,
  GetOrderBillDetailByIdResponse,
  GetOrderBillPageResponse,
  ItemListResponse,
  OrderBillItemPage,
  OrderEventResponse,
  ReceiverResponse,
} from './payload/order-bill.response';
import { UserRepository } from '../../repository/user.repository';
import { paginate } from 'nestjs-typeorm-paginate';
import { createActor, createMachine, interpret } from 'xstate';
import { householdMachine } from './order-bill.machine';
import { OrderBillEvent, OrderBillStatus, Role } from '../../common/enum';
import { OrderEventEntity } from '../../entity/order/order-event.entity';
import { plainToInstance } from 'class-transformer';
import { OrderEventRepository } from '../../repository/order-event.repository';
import { AuthContextService } from '../../service/auth-context.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class OrderBillService {
  private readonly logger = new Logger(OrderBillService.name);
  constructor(
    private readonly orderBillRepository: OrderBillRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly orderEventRepository: OrderEventRepository,
    private readonly authContextService: AuthContextService,
  ) {}

  async createOrderBill(body: CreateOrderBillRequest): Promise<CreateOrderResponse> {
    const userEntity = await this.userRepository.findOneBy({ id: body.userId });
    if (!userEntity) {
      throw new AppError(ErrorResponseData.USER_NOT_FOUND);
    }

    let totalOrder = 0;

    let orderBill = new OrderBillEntity();
    const orderItemList: OrderItemEntity[] = [];
    for (const item of body.itemList) {
      const product = await this.productRepository.getProductAvailableById(item.productId);
      let productPrice = product.price;
      if (item.skuId) {
        productPrice = product.productSKUList.find((sku) => sku.id === item.skuId).price;
      }
      totalOrder += productPrice * item.quantity;
      orderItemList.push({
        productName: product.name,
        thumbnailUrl: product.productImageList[0].imageUrl,
        productId: item.productId,
        skuId: item.skuId,
        skuName: product.productSKUList.find((sku) => sku.id === item.skuId)?.name,
        quantity: item.quantity,
        price: productPrice,
        note: item.note,
      } as OrderItemEntity);
    }

    if (totalOrder !== body.totalOrder) {
      throw new AppError(ErrorResponseData.DATA_SEND_INVALID);
    }

    const receiver = {
      name: body.receiver.name,
      phoneNumber: body.receiver.phoneNumber,
      address: body.receiver.address,
    } as ReceiverEntity;

    orderBill = {
      ...orderBill,
      user: userEntity,
      orderItemList,
      receiver,
      totalOrder,
      note: body.note,
      type: body.orderType,
      orderEventList: [
        {
          status: OrderBillStatus.CREATED,
        } as OrderEventEntity,
      ],
    };

    const orderBillEntity = await this.orderBillRepository.save(orderBill);
    return { orderBillId: orderBillEntity.id };
  }

  async getOrderBillDetail(orderBillId: number): Promise<GetOrderBillDetailByIdResponse> {
    const orderBillEntity = await this.orderBillRepository.findOneBy({ id: orderBillId });
    const itemList = [];
    for (const item of orderBillEntity.orderItemList) {
      const itemData = {
        thumbnailUrl: item.thumbnailUrl,
        productId: item.productId,
        skuId: item.skuId,
        skuName: item.skuName,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        note: item.note,
      } as ItemListResponse;

      itemList.push(itemData);
    }
    const receiverData = {
      name: orderBillEntity.receiver.name,
      phoneNumber: orderBillEntity.receiver.phoneNumber,
      address: orderBillEntity.receiver.address,
    } as ReceiverResponse;

    return {
      id: orderBillEntity.id,
      type: orderBillEntity.type,
      itemList: itemList,
      receiver: receiverData,
      totalOrder: orderBillEntity.totalOrder,
      note: orderBillEntity.note,
      orderEventList: orderBillEntity.orderEventList
        .map((item) => {
          return {
            status: item.status,
            note: item.note,
            createdAt: item.createdAt,
          } as OrderEventResponse;
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      createdAt: orderBillEntity.createdAt,
    };
  }

  async getOrderBillPage(page: number, size: number, userId: number): Promise<GetOrderBillPageResponse> {
    const orderBillPage = await paginate<OrderBillEntity>(
      this.orderBillRepository,
      { page: page, limit: size },
      { where: { user: { id: userId } } },
    );

    return {
      totalPage: orderBillPage.meta.totalPages,
      orderList: orderBillPage.items
        .map((item) => {
          const productName = `${item.orderItemList[0].productName}${item.orderItemList[0].skuName ? ` - ${item.orderItemList[0].skuName}` : ''}`;
          return {
            id: item.id,
            imageUrl: item.orderItemList[0].thumbnailUrl,
            productName: productName,
            totalOrder: item.totalOrder,
            createdAt: item.createdAt,
            status: item.orderEventList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].status,
          };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    };
  }

  @Transactional()
  async updateOrderBillStatus(id: number, body: UpdateOrderBillEventRequest) {
    const userContext = this.authContextService.getUser();
    const orderEntity = await this.orderBillRepository.findOneBy({ id });

    if (!orderEntity) {
      throw new AppError(ErrorResponseData.ORDER_NOT_FOUND);
    }
    const currentOrderStatus = orderEntity.orderEventList.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )[0].status;
    console.log('🚀 ~ OrderBillService ~ orderActor ~ currentOrderStatus:', currentOrderStatus);
    const orderActor = createActor(householdMachine(currentOrderStatus), {
      input: {
        actorRole: userContext.role,
      },
    }).start();

    const initialState = orderActor.getSnapshot();
    if (initialState.can({ type: body.orderEvent })) {
      orderActor.send({ type: body.orderEvent });
      const status = orderActor.getSnapshot().value;
      const newEvent = this.orderEventRepository.create({
        status: status,
        note: body.note,
        orderBill: orderEntity,
      });
      return await this.orderEventRepository.save(newEvent);
    }
    throw new AppError(ErrorResponseData.FLOW_INCORRECT);
  }
}
