import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

export class TokenPayload {
  sub: string;
  username: string;
  type: 'refresh' | 'access';
}
