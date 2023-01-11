import {
  DynamicModule,
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';
import { AdminSecretToken } from './admin.tokens';
import { AdminController } from './application/controllers/admin.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AdminGuard } from './application/guard/admin.guard';

@Module({
  controllers: [AdminController],
  imports: [AuthenticationModule],
  providers: [AdminGuard],
  exports: [AdminSecretToken],
})
export class AdminModule {
  private static readonly secretFilePath = './secret';

  private static async getSecret() {
    const fileMissing = await fs.access(this.secretFilePath).then(
      () => false,
      () => true
    );
    const secret = fileMissing
      ? crypto.randomBytes(256).toString('base64')
      : (await fs.readFile(this.secretFilePath)).toString();

    if (fileMissing) {
      await fs.writeFile(this.secretFilePath, secret);
      Logger.verbose(`Your api key is ${secret}`, 'Admin');
    }
    return secret;
  }

  public static forRoot(): DynamicModule {
    return {
      module: AdminModule,
      global: true,
      providers: [
        {
          useFactory: () => this.getSecret(),
          provide: AdminSecretToken,
        },
      ],
    };
  }
}
