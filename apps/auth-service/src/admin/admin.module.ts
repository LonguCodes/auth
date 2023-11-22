import { DynamicModule, Logger, Module } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';
import { AdminModuleOptionsToken, AdminSecretToken } from './admin.tokens';
import { AdminGuard } from './application/guard/admin.guard';
import { ModuleOptionsFactory } from '@longucodes/common';

export interface AdminModuleOptions {
  secretFilePath?: string;
}

@Module({
  controllers: [],
  imports: [],
  providers: [],
})
export class AdminModule {
  private static async getSecret(filePath: string) {
    const fileMissing = await fs.access(filePath).then(
      () => false,
      () => true
    );
    const secret = fileMissing
      ? crypto.randomBytes(256).toString('base64')
      : (await fs.readFile(filePath)).toString();

    if (fileMissing) {
      await fs.writeFile(filePath, secret);
      Logger.verbose(`Your api key is ${secret}`, 'Admin');
    }
    return secret;
  }
  public static forRootAsync(
    optionsFactory: ModuleOptionsFactory<AdminModuleOptions>
  ): DynamicModule {
    return {
      module: AdminModule,
      global: optionsFactory.global,
      providers: [
        {
          ...optionsFactory,
          provide: AdminModuleOptionsToken,
        },
        {
          inject: [AdminModuleOptionsToken],
          useFactory: (options: AdminModuleOptions) =>
            this.getSecret(options.secretFilePath ?? './secret'),
          provide: AdminSecretToken,
        },
        AdminGuard,
      ],
      exports: [AdminSecretToken],
    };
  }
}
