import { DataSource, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async find() {
    return await super.find();
  }
}
