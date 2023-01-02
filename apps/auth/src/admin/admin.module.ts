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
})
export class AdminModule implements OnModuleInit {
  private static readonly secretFilePath = './secret';

  private static async getSecret() {
    const fileMissing = await fs.access(this.secretFilePath).then(
      () => false,
      () => true
    );
    const secret = fileMissing
      ? crypto.randomBytes(256).toString('base64')
      : await fs.readFile(this.secretFilePath);

    if (fileMissing) await fs.writeFile(this.secretFilePath, secret);
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

  constructor(@Inject(AdminSecretToken) private readonly secret: string) {}

  async onModuleInit(): Promise<void> {
    Logger.verbose(
      `To use admin api, send header Authentication: Bearer ${this.secret}`,
      'Admin'
    );
  }
}
