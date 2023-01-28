import { DynamicModule, Module } from '@nestjs/common';
import {
  RabbitModule,
  RabbitModuleExchange,
} from '@longucodes/amqp/src/lib/rabbit.module';
import { AuthRabbitPluginOptionsToken } from './amqp.tokens';
import { AmqpEmitter } from './amqp.emitter';

export interface AuthRabbitPluginOptions {
  url: string;
  exchange: string;
  exchangeType?: RabbitModuleExchange['type'];
  prefix?: string;
  assert?: boolean;
}

@Module({})
class AuthRabbitModule {
  public static forRoot(options: AuthRabbitPluginOptions): DynamicModule {
    return {
      module: AuthRabbitModule,
      global: true,
      imports: [
        RabbitModule.forRoot({
          exchanges: [
            { name: options.exchange, type: options.exchangeType ?? 'topic' },
          ],
          url: `amqp://${options.url}`,
          assert: options.assert,
        }),
      ],
      providers: [
        {
          useValue: options,
          provide: AuthRabbitPluginOptionsToken,
        },
        AmqpEmitter,
      ],
    };
  }
}

export default AuthRabbitModule;
