import { DynamicModule, Module } from '@nestjs/common';
import { RabbitModule } from '@longucodes/amqp';
import { AmqpEventModuleConfigToken } from './tokens';
import { AmqpEmitter } from './application/amqp.emitter';
import { Value } from '../common/types';
import { ModuleOptionsFactory } from '@auth/auth-core';
import { EventModuleCore, EventModuleOptions } from './event.module.core';
import { SocketIoEmitter } from './application/socket-io.emitter';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot({ global: true, wildcard: true })],
})
export class EventModule {
  private static getAmqp(options: ModuleOptionsFactory<EventModuleOptions>) {
    return {
      providers: [AmqpEmitter],
      imports: [
        RabbitModule.forRootAsync({
          imports: [EventModuleCore.forRootAsync(options)],
          inject: [{ token: AmqpEventModuleConfigToken, optional: true }],
          useFactory: (options?: Value<EventModuleOptions, 'amqp'>) => ({
            url: options?.url ? `amqp://${options.url}` : undefined,
            logLevel: options ? 'error' : 'debug',
            assert: options?.assert,
            exchanges: options
              ? [{ type: 'topic', name: options?.exchange }]
              : [],
          }),
        }),
      ],
    };
  }

  private static getSocket() {
    return {
      providers: [SocketIoEmitter],
    };
  }

  public static forRootAsync(
    options: ModuleOptionsFactory<EventModuleOptions>
  ): DynamicModule {
    const amqp = this.getAmqp(options);
    const socket = this.getSocket();

    return {
      module: EventModule,
      global: true,
      imports: [EventModuleCore.forRootAsync(options), ...amqp.imports],
      providers: [...amqp.providers, ...socket.providers],
    };
  }
}
