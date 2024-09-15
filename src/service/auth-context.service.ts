import { Injectable } from '@nestjs/common';
import { Role } from '../common/enum';

export type UserContextType = {
  id: number;
  email: string;
  role: Role;
};
export type AuthContextType = {
  user?: UserContextType;
};

@Injectable()
export class AuthContextService {
  private context: AuthContextType;

  getUser() {
    return this.context.user;
  }
  setUser(user: UserContextType) {
    if (user) this.context = { user: user };
  }
}
