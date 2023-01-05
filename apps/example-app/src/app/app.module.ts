import { Module } from '@nestjs/common';
import { AuthModule, AuthEventsModule } from '@longucodes/nest-auth';
import { WelcomeModule } from '../welcome/welcome.module';
import { ConfigModule, ConfigToken } from '@longucodes/config';
import { ConfigInterface } from '../config/config.interface';
import { configSchema } from '../config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      loadEnv: true,
      schema: configSchema,
      global: true,
    }),
    AuthModule.forRootAsync({
      global: true,
      inject: [ConfigToken],
      useFactory: (config: ConfigInterface) => ({
        registerMiddleware: true,
        core: {
          host: config.auth.coreHost,
        },
      }),
    }),
    AuthEventsModule.forRoot({ global: true }),
    WelcomeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
