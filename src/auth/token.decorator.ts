import { SetMetadata } from '@nestjs/common';

export const TOKEN = 'expectedToken';
export const RequiredTokenType = (tokenType: 'access' | 'refresh') =>
  SetMetadata(TOKEN, tokenType);
