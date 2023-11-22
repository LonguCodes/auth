import { AuthModuleOptions, AuthOptionsToken } from './auth.options';
import {
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { KeyRepository } from './infrastructure/repository/key.repository';
import { AuthGuard, AuthMiddleware, RoleGuard } from './application';
import { ModuleOptionsFactory } from '@longucodes/common';

@Module({
  exports: [AuthMiddleware, AuthGuard, RoleGuard],
  providers: [KeyRepository, AuthMiddleware, AuthGuard, RoleGuard],
})
export class AuthModule implements OnModuleInit, NestModule {
  public static forRootAsync(
    options: ModuleOptionsFactory<AuthModuleOptions>
  ): DynamicModule {
    return {
      module: AuthModule,
      global: options.global,
      providers: [{ ...options, provide: AuthOptionsToken }],
      exports: [AuthOptionsToken],
    };
  }

  public static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      global: options.global,
      providers: [{ useValue: options, provide: AuthOptionsToken }],
      exports: [AuthOptionsToken],
    };
  }

  constructor(
    private readonly keyRepository: KeyRepository,
    @Inject(AuthOptionsToken) private readonly options: AuthModuleOptions
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    if (this.options.registerMiddleware)
      consumer.apply(AuthMiddleware).forRoutes('*');
  }

  async onModuleInit(): Promise<void> {
    await this.keyRepository.getPublicKey();
  }
}
