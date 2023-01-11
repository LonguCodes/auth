import { Inject, Injectable, Logger } from '@nestjs/common';
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
    const client = io(`ws://${options.core.host}`, {
      auth: {
        authentication: options.core.apiKey,
      },
    }).connect();

    client.on('connect', () => {
      Logger.log('Connected to core, listening for events', 'Events');
    });

    client.onAny((name, payload) => {
      eventEmitter.emit(
        `${this.eventsOptions.prefix ?? 'auth'}.${name}`,
        payload
      );
    });
    client.on('disconnect', (reason, description) => {
      switch (reason) {
        case 'io server disconnect':
          Logger.error(
            'Websocket connection authentication failed. Are you missing the apiKey?',
            'Events'
          );
          break;
        case 'transport close':
          Logger.error(
            'Websocket connection abruptly ended, trying to reconnect.',
            'Events'
          );
      }
    });
  }
}
