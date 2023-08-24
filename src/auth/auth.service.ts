import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import { Status } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { LoginPayload, TokenPayload } from './dto/auth.objects';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
  ) {}

  public async login(email: string, password: string): Promise<LoginPayload> {
    const customer = await this.customerService.get(email);

    if (!customer) {
      throw new UnauthorizedException();
    }

    if (!(await compare(password, customer.password))) {
      throw new UnauthorizedException();
    }

    if (customer.status !== Status.ACTIVE) {
      throw new UnauthorizedException();
    }

    const payload: TokenPayload = {
      sub: customer.id,
      username: customer.email,
      type: 'access',
    };

    const tokens = await Promise.all([
      this.jwtService.signAsync(
        { ...payload, type: 'refresh' },
        { expiresIn: '1d' },
      ),
      this.jwtService.signAsync({ ...payload, type: 'access' }),
    ]);

    return { refreshToken: tokens[0], accessToken: tokens[1] };
  }

  public async refresh(user: TokenPayload) {
    if (user.type !== 'refresh') {
      throw new UnauthorizedException();
    }

    const payload: TokenPayload = {
      sub: user.sub,
      username: user.username,
      type: 'access',
    };

    return this.jwtService.signAsync({ ...payload, type: 'access' });
  }

  public async me(user: TokenPayload) {
    return user['username'];
  }

  public async signup(email: string, password: string) {
    const code = 10000 + Math.floor(Math.random() * 10000);
    const hashedPassword = await hash(password, 10);
    const createData = {
      email,
      status: Status.PENDING,
      code: `${code}`,
      password: hashedPassword,
    };

    return !!(await this.customerService.create(createData));
  }

  public async activate(email: string, code: string) {
    const customer = await this.customerService.get(email);

    if (!customer) {
      return false;
    }

    if (customer.status != Status.PENDING || customer.code != code) {
      return false;
    }

    customer.code = null;
    customer.status = Status.ACTIVE;

    await this.customerService.update(email, customer);

    return true;
  }
}
