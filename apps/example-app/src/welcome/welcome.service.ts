import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class WelcomeService {
  @OnEvent('auth.signup')
  private async OnSignup(payload) {
    Logger.verbose(`${payload.email} just registered!`);
  }
}
