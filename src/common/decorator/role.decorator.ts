import { Reflector } from '@nestjs/core';
import { Role } from '../enum';

export const HasAuthorize = Reflector.createDecorator<Role[]>();
