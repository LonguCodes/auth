import { Inject, Injectable } from '@nestjs/common';
import {
  AuthModuleOptions,
  AuthOptionsToken,
} from '../../../auth/auth.options';
import axios from 'axios';

@Injectable()
export class ClientFactory {
  constructor(
    @Inject(AuthOptionsToken) private readonly authConfig: AuthModuleOptions
  ) {}

  public createClient() {
    return axios.create({
      baseURL: `http://${this.authConfig.core.host}/api`,
      headers: {
        Authorization: `Bearer ${this.authConfig.core.apiKey}`,
      },
    });
  }
}
