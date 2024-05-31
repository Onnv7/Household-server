import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantEntity } from '../entity/merchant.entity';
import { Repository } from 'typeorm';
import { Role } from '../common/enum';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InitService implements OnApplicationBootstrap {
  private readonly logger = new Logger(InitService.name);
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantRepository: Repository<MerchantEntity>,
    private readonly configService: ConfigService,
  ) {}
  async onApplicationBootstrap() {
    this.logger.log('Application has been initialized.');
    // Thực hiện các tác vụ khởi động ở đây
    let merchantEntity = await this.merchantRepository.findOneBy({
      username: 'admin',
    });
    if (merchantEntity) {
      this.logger.log('Admin has been initialized');
    } else {
      merchantEntity = {
        username: this.configService.get<string>('ADMIN_USERNAME'),
        password: await bcrypt.hash(
          this.configService.get<string>('ADMIN_PASSWORD'),
          7,
        ),
        role: Role.ROLE_ADMIN,
      } as MerchantEntity;
      await this.merchantRepository.save(merchantEntity);
    }
  }
}
