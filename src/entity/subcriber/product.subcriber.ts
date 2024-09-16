import { Connection, DataSource, EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from '../product/product.entity';
import { InjectConnection, InjectDataSource } from '@nestjs/typeorm';

@Injectable()
@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<ProductEntity> {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    dataSource.subscribers.push(this); // <---- THIS
  }
  listenTo() {
    return ProductEntity;
  }

  async afterUpdate(event: UpdateEvent<ProductEntity>): Promise<void> {
    const productId = event.entity.id;

    await this.cacheManager.del(`/api/product/${productId}/visible`);
    await this.clearCacheByPrefix('/api/product/visible');
  }
  private async clearCacheByPrefix(prefix: string): Promise<void> {
    const keys = await this.cacheManager.store.keys(`${prefix}*`);
    for (const key of keys) {
      await this.cacheManager.del(key);
    }
  }
}
