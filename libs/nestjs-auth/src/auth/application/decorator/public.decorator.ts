import { SetMetadata } from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';

export const Public = () => SetMetadata(AuthGuard.PUBLIC_METADATA_KEY, true);
