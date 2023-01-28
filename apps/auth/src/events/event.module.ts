import { DynamicModule, Module } from '@nestjs/common';
import { EventModuleCore, EventModuleOptions } from './event.module.core';
import { WebsocketEmitter } from './application/emitter/websocket.emitter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ModuleOptionsFactory } from '@longucodes/auth-core';
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
})
export class EventModule {
  private static getSocket() {
    return {
      providers: [WebsocketEmitter],
    };
  }

  public static forRootAsync(
    options: ModuleOptionsFactory<EventModuleOptions>
  ): DynamicModule {
    const socket = this.getSocket();

    return {
      module: EventModule,
      global: true,
      imports: [EventModuleCore.forRootAsync(options)],
      providers: [...socket.providers],
    };
  }
}
