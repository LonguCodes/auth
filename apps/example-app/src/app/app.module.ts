import { Module } from '@nestjs/common';
import { AuthModule, AuthEventsModule } from '@auth/auth-core';
import { WelcomeModule } from '../welcome/welcome.module';
import { ConfigToken } from '@longucodes/config';
import { ConfigInterface } from '../config/config.interface';

@Module({
  imports: [
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
