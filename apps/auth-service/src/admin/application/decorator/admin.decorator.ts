import { SetMetadata } from '@nestjs/common';
import { AdminGuard } from '../guard/admin.guard';

export const Admin = () => SetMetadata(AdminGuard.ADMIN_METADATA_KEY, true);
