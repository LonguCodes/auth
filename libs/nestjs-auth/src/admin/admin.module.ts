import { Module } from '@nestjs/common';
import { AuthModule } from '@longucodes/nest-auth';
import { ClientFactory } from './infrastructure/factory/client.factory';
import { AuthUserRepository } from './infrastructure/auth-user.repository';

@Module({
  imports: [AuthModule],
  providers: [ClientFactory, AuthUserRepository],
  exports: [AuthUserRepository],
})
export class AdminModule {}
