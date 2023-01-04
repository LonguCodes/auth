import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { EventDto } from '../domain/event.dto';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({})
@Injectable()
export class SocketIoEmitter {
  @WebSocketServer()
  server: Server;

  @OnEvent('**')
  handleEvent(event: EventDto) {
    if (!this.server) return;
    this.server.emit(event.name, event.payload);
  }
}
