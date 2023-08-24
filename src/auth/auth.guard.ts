import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomerService } from 'src/customer/customer.service';
import { TOKEN } from './token.decorator';
import { ROLE } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private customerService: CustomerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const request = ctx.request;
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const acceptedToken =
      this.reflector.get<string>(TOKEN, context.getHandler()) || 'access';

    const acceptedRole = this.reflector.get<string>(ROLE, context.getHandler());

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      if (payload.type !== acceptedToken) {
        throw new UnauthorizedException();
      }

      const customer = await this.customerService.get(payload.username);

      if (acceptedRole && acceptedRole !== customer.role) {
        throw new UnauthorizedException();
      }

      ctx['user'] = payload;
      ctx['customer'] = customer;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
