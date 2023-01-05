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
    AuthenticationModule,
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
    AdminModule.forRoot(),
    EventModule.forRootAsync({
      inject: [ConfigToken],
      useFactory: (config: ConfigInterface) => ({
        amqp: config.events.amqp.enable
          ? {
              ...config.events.amqp,
            }
          : undefined,
      }),
      global: true,
    }),
  ],
})
export class AppModule {}
