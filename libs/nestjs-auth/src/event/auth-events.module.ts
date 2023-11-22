import { DynamicModule, Module } from '@nestjs/common';
import { AuthEventsService } from './auth-events.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthEventsOptionsToken } from './auth-events.tokens';
import { ModuleOptionsFactory } from '@longucodes/common';

export interface AuthEventsModuleOptions {
  /**
   *  Prefix for all emitted events. If not provided, 'auth' will be used.
   */
  prefix?: string;

  /**
   *  Should the module be marked as global.
   */
  global?: boolean;
}

@Module({
  providers: [AuthEventsService],
  imports: [EventEmitterModule.forRoot({ wildcard: true, ignoreErrors: true })],
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
