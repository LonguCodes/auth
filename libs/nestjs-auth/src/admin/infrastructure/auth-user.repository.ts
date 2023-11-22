import { Injectable } from '@nestjs/common';
import { ClientFactory } from './factory/client.factory';
import { AxiosInstance } from 'axios';

@Injectable()
export class AuthUserRepository {
  private readonly client: AxiosInstance;
  constructor(clientFactory: ClientFactory) {
    this.client = clientFactory.createClient();
  }
  public async generateValidationToken(userId: string) {
    return this.client.post('user/validate/generate', { id: userId });
  }
}
