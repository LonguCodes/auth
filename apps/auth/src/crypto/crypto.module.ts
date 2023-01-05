import * as crypto from 'crypto';
import { DynamicModule, FactoryProvider } from '@nestjs/common';
import * as fs from 'fs/promises';
import { ModuleInitError } from './module-init.error';
import { BetterPromise } from '@longucodes/promise';
import { ModuleOptionsFactory } from '@longucodes/auth-core';

export interface CryptoModuleOptions {
  privateKeyPath: string;
  publicKeyPath: string;
  generate?: boolean;
}

const OptionsToken = Symbol('options-token');
export const CryptoKeysToken = Symbol('crypto-keys-token');
export interface CryptoKeys {
  public: string;
  private: string;
}

export class CryptoModule {
  private static async readKeys(options: CryptoModuleOptions) {
    const privateKeyMissing = await fs.access(options.privateKeyPath).then(
      () => false,
      () => true
    );

    const publicKeyMissing = await fs.access(options.publicKeyPath).then(
      () => false,
      () => true
    );

    if (!options.generate && (privateKeyMissing || publicKeyMissing))
      throw new ModuleInitError(`Keys missing`);
    const privateKey = privateKeyMissing
      ? null
      : (await fs.readFile(options.privateKeyPath)).toString();
    const publicKey = publicKeyMissing
      ? null
      : (await fs.readFile(options.publicKeyPath)).toString();
    return {
      privateKey,
      publicKey,
    };
  }

  private static generateKeys() {
    return new BetterPromise<{ privateKey: string; publicKey: string }>(
      (resolve, reject) =>
        crypto.generateKeyPair(
          'rsa',
          {
            privateKeyEncoding: { format: 'pem', type: 'pkcs1' },
            publicKeyEncoding: { format: 'pem', type: 'pkcs1' },
            modulusLength: 2048,
          },
          (err, publicKey1, privateKey1) => {
            if (err) return reject(err);
            return resolve({
              privateKey: privateKey1,
              publicKey: publicKey1,
            });
          }
        )
    );
  }

  public static forRootAsync(
    options: ModuleOptionsFactory<CryptoModuleOptions>
  ): DynamicModule {
    const optionsProvider: FactoryProvider = {
      provide: OptionsToken,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    return {
      module: CryptoModule,
      global: options.global,
      providers: [
        optionsProvider,
        {
          inject: [OptionsToken],
          useFactory: async (options: CryptoModuleOptions) => {
            let { privateKey, publicKey } = await this.readKeys(options);

            if (!privateKey && !publicKey) {
              const keys = await this.generateKeys();
              privateKey = keys.privateKey;
              publicKey = keys.publicKey;
            } else if (!publicKey) {
              publicKey = crypto
                .createPublicKey({
                  key: privateKey,
                  format: 'pem',
                })
                .export({ format: 'pem', type: 'pkcs1' }) as string;
            }

            await fs.writeFile(options.privateKeyPath, privateKey);
            await fs.writeFile(options.publicKeyPath, publicKey);

            return {
              private: privateKey,
              public: publicKey,
            };
          },
          provide: CryptoKeysToken,
        },
      ],
      exports: [CryptoKeysToken],
    };
  }
}
