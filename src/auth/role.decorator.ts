import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLE = 'requiredRole';
export const RequiredRole = (role: Role) => SetMetadata(ROLE, role);
