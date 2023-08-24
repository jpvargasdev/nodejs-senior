import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginPayload, TokenPayload } from './dto/auth.objects';
import { AuthGuard } from './auth.guard';
import { User } from './user.decorator';
import { RequiredTokenType } from './token.decorator';

@Resolver('Authenthication')
export class AuthResolver {
  public constructor(private authService: AuthService) {}

  @Mutation(() => Boolean)
  async activate(@Args('email') email: string, @Args('code') code: string) {
    return this.authService.activate(email, code);
  }

  @Mutation(() => LoginPayload)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Mutation(() => String)
  @RequiredTokenType('refresh')
  @UseGuards(AuthGuard)
  async refresh(@User() user: TokenPayload) {
    return this.authService.refresh(user);
  }

  @Mutation(() => Boolean)
  async signup(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.signup(email, password);
  }
}
