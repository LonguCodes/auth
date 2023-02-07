import { DynamicModule, Module } from '@nestjs/common';
import { GoogleOAuthController } from './application/controllers/google-o-auth.controller';
import { GoogleOAuthService } from './domain/service/google-o-auth.service';
import { PluginCoreModule } from '@longucodes/auth-plugin-core';
import { GoogleOAuthOptionsToken } from './token';

export interface GoogleOAuthOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

@Module({
  controllers: [GoogleOAuthController],
  providers: [GoogleOAuthService],
  imports: [PluginCoreModule.forPlugin({ pluginName: 'google' })],
})
export class GoogleOAuthModule {
  public static forRoot(options: GoogleOAuthOptions): DynamicModule {
    return {
      module: GoogleOAuthModule,
      providers: [{ provide: GoogleOAuthOptionsToken, useValue: options }],
    };
  }
}
