import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ChangeRoleEvent,
  LoginEvent,
  RegisterEvent,
} from '@longucodes/auth-core';
import { AuthUserRepository } from '@longucodes/nest-auth';

@Injectable()
export class WelcomeService {
  constructor(private readonly authUserRepository: AuthUserRepository) {}

  @OnEvent(`auth.${RegisterEvent.Name}`)
  private async OnRegister(payload: RegisterEvent.Payload) {
    Logger.verbose(`${payload.email} just registered! Giving him admin role`);
    await this.authUserRepository.addRole(payload.id, 'admin');
  }

  @OnEvent(`auth.${LoginEvent.Name}`)
  private async OnLogin(payload: LoginEvent.Payload) {
    Logger.verbose(`${payload.email} just logged in!`);
  }

  @OnEvent(`auth.${ChangeRoleEvent.Name}`)
  private async OnChangeRole(payload: ChangeRoleEvent.Payload) {
    Logger.verbose(
      `${payload.email} got new roles, ${
        payload.changeType
      }ed "${payload.delta.join('","')}"`
    );
  }
}
