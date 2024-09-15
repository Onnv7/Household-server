import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { HasAuthorize } from '../decorator/role.decorator';
import { AppError } from '../model/response-api';
import { ErrorResponseData } from '../../constant/response.constant';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requireRoles = this.reflector.get(HasAuthorize, context.getHandler());
    const request = context.switchToHttp().getRequest();
    if (!requireRoles) {
      return true;
    }

    if (!request.user?.role) {
      throw new AppError(ErrorResponseData.UNAUTHORIZED);
    }

    if (requireRoles.some((role) => request.user.role === role)) {
      return true;
    }

    return false;
  }
}
