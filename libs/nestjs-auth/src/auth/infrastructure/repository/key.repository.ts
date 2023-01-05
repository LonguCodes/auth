import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthModuleOptions, AuthOptionsToken } from '../../auth.options';
import { DateTime } from 'luxon';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class KeyRepository {
  private publicKey: string = null;
  private lastFetchTime: DateTime = null;
  private readonly axios: AxiosInstance;

  constructor(
    @Inject(AuthOptionsToken) private readonly config: AuthModuleOptions
  ) {
    this.axios = axios.create({ baseURL: `http://${this.config.core.host}` });
  }

  public async getPublicKey() {
    if (
      this.publicKey &&
      DateTime.now().diff(this.lastFetchTime).shiftTo('hours').hours < 8
    )
      return this.publicKey;
    try {
      const { data } = await this.axios.get(`api/auth/public`);
      this.publicKey = data.key;
      this.lastFetchTime = DateTime.now();
      return this.publicKey;
    } catch (e) {
      Logger.warn(`Failed to fetch public key, ${e.message}`, 'Auth');
    }
  }
}
