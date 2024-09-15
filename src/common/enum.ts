export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
}

export enum OrderType {
  DELIVERY = 'DELIVERY',
  TAKE_AWAY = 'TAKE_AWAY',
}

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  HIDDEN = 'HIDDEN',
}

export enum CategoryStatus {
  VISIBLE = 'VISIBLE',
  HIDDEN = 'HIDDEN',
}

export enum OrderBillStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  PENDING_PICKUP = 'PENDING_PICKUP',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum SortType {
  ASC_PRICE = 'ASC_PRICE',
  DESC_PRICE = 'DESC_PRICE',
  ASC_ALPHABETICAL = 'ASC_ALPHABETICAL',
  DESC_ALPHABETICAL = 'DESC_ALPHABETICAL',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum OrderBillEvent {
  ACCEPT = 'ACCEPT',
  ABORT = 'ABORT',
  CANCEL = 'CANCEL',
  PREPARE = 'PREPARE',
  SUCCEED = 'SUCCEED',
  SHIPPING_FAILED = 'SHIPPING_FAILED',
}
