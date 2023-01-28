import { Module } from '@nestjs/common';
import { WebsocketEmitter } from './application/emitter/websocket.emitter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      global: true,
      wildcard: true,
      ignoreErrors: true,
    }),
    AdminModule,
  ],
  providers: [WebsocketEmitter],
})
export class EventModule {}
