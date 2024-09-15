import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../enum';

export type AppContextType = {
  user: {
    id: number;
    email: string;
    role: Role;
  };
};
export const AppContext = createParamDecorator((data: unknown, ctx: ExecutionContext): AppContextType => {
  const request = ctx.switchToHttp().getRequest();
  return { user: request.user };
});
