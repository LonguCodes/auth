import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoginEvent, RegisterEvent } from '@longucodes/auth-core';

@Injectable()
export class WelcomeService {
  @OnEvent(`auth.${RegisterEvent.Name}`)
  private async OnRegister(payload: RegisterEvent.Payload) {
    Logger.verbose(`${payload.email} just registered!`);
  }

  @OnEvent(`auth.${LoginEvent.Name}`)
  private async OnLogin(payload: LoginEvent.Payload) {
    Logger.verbose(`${payload.email} just logged in!`);
  }
}
