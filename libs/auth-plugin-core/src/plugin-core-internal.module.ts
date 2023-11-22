import { DynamicModule, Global, Module } from '@nestjs/common';
import { PluginCoreServiceInterface } from './domain/interface/plugin-core-service.interface';
import { PluginCoreModuleOptionsToken } from './tokens';
import { ModuleOptionsFactory } from '@longucodes/common';

export interface PluginCoreInternalModuleRootOptions {
  serviceFactory: (pluginName: string) => PluginCoreServiceInterface;
}
@Global()
@Module({})
export class PluginCoreInternalModule {
  public static forRootAsync(
    options: ModuleOptionsFactory<PluginCoreInternalModuleRootOptions>
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
