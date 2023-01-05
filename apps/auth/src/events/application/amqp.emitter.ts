import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventDto } from '../domain/dto/event.dto';
import { RABBIT_CHANNEL_KEY } from '@longucodes/amqp/src/lib/tokens';
import { Channel } from 'amqplib';
import { AmqpEventModuleConfigToken } from '../tokens';

import { Value } from '../../common/types';
import { EventModuleOptions } from '../event.module.core';

@Injectable()
export class AmqpEmitter {
  constructor(
    @Inject(RABBIT_CHANNEL_KEY) private readonly channel: Channel,
    @Inject(AmqpEventModuleConfigToken)
    private readonly config: Value<EventModuleOptions, 'amqp'>
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
