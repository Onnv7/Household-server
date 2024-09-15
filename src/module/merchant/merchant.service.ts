import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantEntity } from '../../entity/merchant.entity';
import { Repository } from 'typeorm';
import { MerchantLoginRequest } from './payload/merchant-request.payload';
import { MerchantLoginResponse } from './payload/merchant-response.payload';
import { AppError } from '../../common/model/response-api';
import { ErrorResponseData } from '../../constant/response.constant';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantRepository: Repository<MerchantEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async merchantLogin(body: MerchantLoginRequest): Promise<MerchantLoginResponse> {
    const merchantEntity = await this.merchantRepository.findOneBy({
      username: body.username,
    });

    if (merchantEntity && (await bcrypt.compare(body.password, merchantEntity.password))) {
      const payload = {
        id: merchantEntity.id,
        username: merchantEntity.username,
        role: merchantEntity.role,
      };
      return {
        merchantId: merchantEntity.id,
        accessToken: this.jwtService.sign(payload),
      } as MerchantLoginResponse;
    }
    throw new AppError(ErrorResponseData.CREDENTIAL_WRONG);
  }
}
