import { DynamicModule, Logger, Module } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';
import { AdminSecretToken } from './admin.tokens';
import { AdminGuard } from './application/guard/admin.guard';

const secretFilePath = './secret';
async function getSecret() {
  const fileMissing = await fs.access(secretFilePath).then(
    () => false,
    () => true
  );
  const secret = fileMissing
    ? crypto.randomBytes(256).toString('base64')
    : (await fs.readFile(secretFilePath)).toString();

  if (fileMissing) {
    await fs.writeFile(secretFilePath, secret);
    Logger.verbose(`Your api key is ${secret}`, 'Admin');
  }
  return secret;
}

@Module({
  controllers: [],
  imports: [],
  providers: [
    AdminGuard,
    {
      useFactory: () => getSecret(),
      provide: AdminSecretToken,
    },
  ],
  exports: [AdminSecretToken],
})
export class AdminModule {}
