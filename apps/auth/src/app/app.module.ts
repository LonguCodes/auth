import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigToken } from '@longucodes/config';
import { ConfigInterface } from '../config/config.interface';
import { entities, migrations } from '../config/entities.config';
import { configSchema } from '../config/config.schema';
import { CryptoModule } from '../crypto/crypto.module';
import { AdminModule } from '../admin/admin.module';
import { EventModule } from '../events/event.module';
import { UserModule } from '../user/user.module';
import { PluginModule } from '@longucodes/plugin-system-loader';
import { PluginCoreModule } from '@longucodes/auth-plugin-core';
import { PluginSupportServiceFactory } from '../plugin/domain/factory/plugin-support.service-factory';
import { PluginSupportModule } from '../plugin/plugin-support.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigToken],
      useFactory: (config: ConfigInterface) => ({
        type: 'postgres',
        ...config.database,
        entities,
        migrations,
      }),
    }),
    ConfigModule.forRoot({
      schema: configSchema,
      global: true,
      loadEnv: true,
    }),
    CryptoModule.forRootAsync({
      global: true,
      inject: [ConfigToken],
      useFactory: (config: ConfigInterface) => config.crypto,
    }),
    EventModule,
    AuthenticationModule,
    AdminModule,
    PluginCoreModule.forRootAsync({
      inject: [PluginSupportServiceFactory],
      imports: [PluginSupportModule],
      useFactory: (factory: PluginSupportServiceFactory) => ({
        serviceFactory: (name) => factory.create(name),
      }),
    }),
    PluginModule.forRoot({ pluginsDefinitionFilePath: './plugins.json' }),
    UserModule,
  ],
})
export class AppModule {}
