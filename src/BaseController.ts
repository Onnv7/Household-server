import { UseGuards, Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from './common/guard/jwt.guard';

@ApiBearerAuth('access-token')
@Controller()
export class BaseController {}
