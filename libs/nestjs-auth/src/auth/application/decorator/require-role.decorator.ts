import { SetMetadata } from '@nestjs/common';
import { RoleGuard } from '../guard/role.guard';

export const Roles = (...roles: string[]) =>
  SetMetadata(RoleGuard.ROLE_METADATA_KEY, roles);
