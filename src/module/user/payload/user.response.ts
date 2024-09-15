import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../entity/user.entity';
import { Gender } from '../../../common/enum';

export class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  static fromUserEntity(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
    };
  }
}

export class GetUserList {
  @ApiProperty()
  totalPages: number;

  @ApiProperty({ type: [User] })
  userList: User[];

  static fromUserEntityList(entityList: UserEntity[]): User[] {
    return entityList.map((entity) => {
      return User.fromUserEntity(entity);
    });
  }
}

export class GetUserProfileResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  gender: Gender;
}
