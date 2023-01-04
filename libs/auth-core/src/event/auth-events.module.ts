import { DynamicModule, Module } from '@nestjs/common';
import { AuthEventsService } from './auth-events.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ModuleOptionsFactory } from '@auth/auth-core';
import { AuthEventsOptionsToken } from './auth-events.tokens';

export interface AuthEventsModuleOptions {
  prefix?: string;
  global?: boolean;
}

@Module({
  providers: [AuthEventsService],
  imports: [EventEmitterModule.forRoot({ wildcard: true })],
})
export class AuthEventsModule {
  public static forRootAsync(
    options: ModuleOptionsFactory<AuthEventsModuleOptions>
  ): DynamicModule {
    return {
      module: AuthEventsModule,
      providers: [
        {
          provide: AuthEventsOptionsToken,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
    };
  }
  public static forRoot(options: AuthEventsModuleOptions): DynamicModule {
    return {
      module: AuthEventsModule,
      providers: [
        {
          provide: AuthEventsOptionsToken,
          useValue: options,
        },
      ],
    };
  }
}
