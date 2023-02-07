import { OAuth2Client } from 'google-auth-library';
import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  PluginCoreServiceInterface,
  PluginCoreServiceToken,
} from '@longucodes/auth-plugin-core';
import { GoogleOAuthOptionsToken } from '../../token';
import { GoogleOAuthOptions } from '../../google-o-auth.module';
import { SocialLoginFailedError } from '../errors/social-login-failed.error';

@Injectable()
export class GoogleOAuthService {
  constructor(
    @Inject(PluginCoreServiceToken)
    private readonly pluginCoreService: PluginCoreServiceInterface,
    @Inject(GoogleOAuthOptionsToken)
    private readonly options: GoogleOAuthOptions
  ) {}

  public async login(code: string) {
    try {
      const {
        tokens: { id_token: token },
      } = await new OAuth2Client({
        clientId: this.options.clientId,
        clientSecret: this.options.clientSecret,
        redirectUri: this.options.redirectUri,
      }).getToken(code);
      const ticket = await new OAuth2Client(
        this.options.clientId
      ).verifyIdToken({
        idToken: token,
        audience: this.options.clientId,
      });
      const { sub: googleId, email } = ticket.getPayload();
      let userId = await this.pluginCoreService.getIdByEmail(email);

      if (!userId) {
        userId = await this.pluginCoreService.createUser(email, true);
      }

      await this.pluginCoreService.setProperty(userId, 'googleId', googleId);

      return this.pluginCoreService.loginUser(userId);
    } catch (e) {
      throw new SocialLoginFailedError('Login failed');
    }
  }
}