import { Injectable } from '@nestjs/common';
import { ClientFactory } from './factory/client.factory';
import { AxiosInstance } from 'axios';

@Injectable()
export class AuthUserRepository {
  private readonly client: AxiosInstance;
  constructor(clientFactory: ClientFactory) {
    this.client = clientFactory.createClient();
  }

  public async addRole(userId: string, role: string) {
    return this.client.post(`user/role/add`, { userId, role });
  }

  public async removeRole(userId: string, role: string) {
    return this.client.post(`user/role/remove`, { userId, role });
  }
}