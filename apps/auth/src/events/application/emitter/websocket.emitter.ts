import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { EventDto } from '@longucodes/auth-core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AdminSecretToken } from '../../../admin/admin.tokens';

@WebSocketGateway({})
@Injectable()
export class WebsocketEmitter implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(AdminSecretToken) private readonly secret: string) {}

  @OnEvent('**')
  handleEvent(event: EventDto) {
    if (!this.server) return;
    this.server.emit(event.name, event.payload);
  }

  handleConnection(client: Socket): void {
    const clientApiToken = client.handshake.auth.authentication;
    if (clientApiToken !== this.secret) {
      Logger.verbose('Client failed authentication', 'Events|Websockets');
      client.disconnect(true);
    } else {
      Logger.verbose(`New client connected`, 'Events|Websockets');
    }
  }
}
