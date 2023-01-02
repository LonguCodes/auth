import { AuthModuleOptions, OptionsToken } from './auth.options';
import {
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { KeyRepository } from './infrastructure/repository/key.repository';
import { AuthGuard, AuthMiddleware } from './application';
import { ModuleOptionsFactory } from './auth.types';

@Module({})
export class AuthModule implements OnModuleInit, NestModule {
  public static forRootAsync(
    options: ModuleOptionsFactory<AuthModuleOptions>
  ): DynamicModule {
    return {
      module: AuthModule,
      global: options.global,
      providers: [
        { ...options, provide: OptionsToken },
        KeyRepository,
        AuthMiddleware,
        AuthGuard,
      ],
      exports: [AuthMiddleware, AuthGuard],
    };
  }

  constructor(
    private readonly keyRepository: KeyRepository,
    @Inject(OptionsToken) private readonly options: AuthModuleOptions
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    if (this.options.registerMiddleware)
      consumer.apply(AuthMiddleware).forRoutes('*');
  }

  async onModuleInit(): Promise<void> {
    await this.keyRepository.getPublicKey();
  }
}
