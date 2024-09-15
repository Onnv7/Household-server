import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entity/user.entity';
import { Repository } from 'typeorm';
import { GetUserList, GetUserProfileResponse, User } from './payload/user.response';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { classToPlain, instanceToPlain, plainToInstance } from 'class-transformer';
import { UpdateUserProfileRequest } from './payload/user.request';
import { AppError } from '../../common/model/response-api';
import { ErrorResponseData } from '../../constant/response.constant';
import { UserRepository } from '../../repository/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async getUserList(page: number, size: number): Promise<GetUserList> {
    const options: IPaginationOptions = {
      page: page,
      limit: size,
    };
    const data: Pagination<UserEntity> = await paginate<UserEntity>(this.userRepository, options);

    return {
      userList: GetUserList.fromUserEntityList(data.items),
      totalPages: data.meta.totalPages,
    };
  }

  async updateProfile(userId: number, body: UpdateUserProfileRequest) {
    const userEntity = await this.userRepository.findOneBy({ id: userId }).then((user) => {
      if (!user) {
        throw new AppError(ErrorResponseData.USER_NOT_FOUND);
      }
      return user;
    });
    await this.userRepository.save({ ...userEntity, ...body });
  }

  async getUserProfile(userId: number): Promise<GetUserProfileResponse> {
    const userEntity = await this.userRepository.findOneBy({ id: userId }).then((user) => {
      if (!user) {
        throw new AppError(ErrorResponseData.USER_NOT_FOUND);
      }
      return user;
    });
    return {
      id: userEntity.id,
      email: userEntity.email,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      gender: userEntity.gender,
    } as GetUserProfileResponse;
  }
}
