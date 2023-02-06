import { DynamicModule, Global, Module } from '@nestjs/common';
import { PluginCoreServiceInterface } from './domain/interface/user-entity.interface';
import { PluginCoreModuleOptionsToken } from './tokens';
import { ModuleOptionsFactoryWithImports } from '@longucodes/auth-core';

export interface PluginCoreInternalModuleRootOptions {
  serviceFactory: (pluginName: string) => PluginCoreServiceInterface;
}
@Global()
@Module({})
export class PluginCoreInternalModule {
  public static forRootAsync(
    options: ModuleOptionsFactoryWithImports<PluginCoreInternalModuleRootOptions>
  ): DynamicModule {
    return {
      module: PluginCoreInternalModule,
      global: true,
      imports: options.imports,
      providers: [{ ...options, provide: PluginCoreModuleOptionsToken }],
      exports: [PluginCoreModuleOptionsToken],
    };
  }
}
