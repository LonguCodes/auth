import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RABBIT_CHANNEL_KEY } from '@longucodes/amqp/src/lib/tokens';
import { Channel } from 'amqplib';
import { AuthRabbitPluginOptions } from './index';
import { AuthRabbitPluginOptionsToken } from './amqp.tokens';
import { EventDto } from '@longucodes/auth-core';

@Injectable()
export class AmqpEmitter {
  constructor(
    @Inject(RABBIT_CHANNEL_KEY) private readonly channel: Channel,
    @Inject(AuthRabbitPluginOptionsToken)
    private readonly config: AuthRabbitPluginOptions
  ) {}

  @OnEvent('*')
  handleEvent(event: EventDto) {
    if (!this.channel) return;
    this.channel.publish(
      this.config.exchange,
      (this.config.prefix ?? '') + event.name,
      Buffer.from(JSON.stringify(event.payload))
    );
  }
}
