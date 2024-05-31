import { ApiProperty, ApiResponse } from '@nestjs/swagger';

export class Hello {
  @ApiProperty()
  statement: string;
}

export class LoginUserResponse {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  accessToken: string;
}
