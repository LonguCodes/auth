import { Module } from '@nestjs/common';
import { PluginSupportServiceFactory } from './domain/factory/plugin-support.service-factory';
import { UserModule } from '../user/user.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  providers: [PluginSupportServiceFactory],
  exports: [PluginSupportServiceFactory],
  imports: [UserModule, AuthenticationModule],
})
export class PluginSupportModule {}
