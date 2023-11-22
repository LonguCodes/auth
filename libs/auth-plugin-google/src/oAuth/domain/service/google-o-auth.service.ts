import { OAuth2Client } from 'google-auth-library';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
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

  public async login(code: string, redirectUri?: string) {
    try {
      const {
        tokens: { id_token: token },
      } = await new OAuth2Client({
        clientId: this.options.clientId,
        clientSecret: this.options.clientSecret,
        redirectUri: redirectUri ?? this.options.redirectUri,
      }).getToken(code);

      const ticket = await new OAuth2Client(
        this.options.clientId
      ).verifyIdToken({
        idToken: token,
        audience: this.options.clientId,
      });

      const ticketPayload = ticket.getPayload();
      const { sub: googleId, email } = ticketPayload;

      let userId = await this.pluginCoreService.getIdByEmail(email);

      if (!userId) {
        const additionalInformation = this.options.extractInformation
          ?.filter((key) => key in ticketPayload)
          .reduce((curr, key) => ({ ...curr, [key]: ticketPayload[key] }), {});
        Logger.debug(`User ${email} not found, creating`, 'Plugin|Google');
        userId = await this.pluginCoreService.createUser(
          email,
          true,
          additionalInformation
        );
      }

      await this.pluginCoreService.setClaim(userId, 'googleId', googleId);

      return this.pluginCoreService.loginUser(userId);
    } catch (e) {
      Logger.debug(`Login failed: ${e.message}`, 'Plugin|Google');
      throw new SocialLoginFailedError('Login failed');
    }
  }
}
