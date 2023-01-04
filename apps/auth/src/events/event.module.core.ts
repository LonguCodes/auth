import { AmqpEventModuleConfigToken, EventModuleConfigToken } from './tokens';
import { RabbitModuleExchange } from '@longucodes/amqp/src/lib/rabbit.module';
import { ModuleOptionsFactory } from '@auth/auth-core';
import { Module } from '@nestjs/common';

export interface EventModuleOptions {
  amqp?: {
    url: string;
    exchange: string;
    exchangeType?: RabbitModuleExchange['type'];
    prefix?: string;
    assert?: boolean;
  };
}

@Module({})
export class EventModuleCore {
  public static forRootAsync(
    options: ModuleOptionsFactory<EventModuleOptions>
  ) {
    return {
      module: EventModuleCore,
      exports: [EventModuleConfigToken, AmqpEventModuleConfigToken],
      providers: [
        {
          ...options,
          provide: EventModuleConfigToken,
        },
        {
          provide: AmqpEventModuleConfigToken,
          inject: [EventModuleConfigToken],
          useFactory: (options: EventModuleOptions) => options.amqp,
        },
      ],
    };
  }
}
