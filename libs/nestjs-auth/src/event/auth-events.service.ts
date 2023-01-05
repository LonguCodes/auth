import { Inject, Injectable } from '@nestjs/common';
import { io } from 'socket.io-client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthModuleOptions, AuthOptionsToken } from '../auth/auth.options';
import { AuthEventsOptionsToken } from './auth-events.tokens';
import { AuthEventsModuleOptions } from './auth-events.module';

@Injectable()
export class AuthEventsService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(AuthOptionsToken) private readonly options: AuthModuleOptions,
    @Inject(AuthEventsOptionsToken)
    private readonly eventsOptions: AuthEventsModuleOptions
  ) {
    const client = io(`ws://${options.core.host}`).connect();
    client.onAny((name, payload) => {
      eventEmitter.emit(
        `${this.eventsOptions.prefix ?? 'auth'}.${name}`,
        payload
      );
    });
  }
}
