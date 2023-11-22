import { DynamicModule, Module, Scope } from '@nestjs/common';
import { PluginCoreServiceInterface } from './domain/interface/plugin-core-service.interface';
import { PluginCoreModuleOptionsToken, PluginNameToken } from './tokens';
import { PluginCoreServiceToken } from './tokens.public';
import {
  PluginCoreInternalModule,
  PluginCoreInternalModuleRootOptions,
} from './plugin-core-internal.module';
import { ModuleOptionsFactory } from '@longucodes/common';

export interface PluginCoreModuleRootOptions {
  global: boolean;
  serviceFactory: (pluginName: string) => PluginCoreServiceInterface;
}

export interface PluginCoreModulePluginOptions {
  pluginName: string;
}

@Module({})
export class PluginCoreModule {
  public static forRootAsync(
    options: ModuleOptionsFactory<PluginCoreModuleRootOptions>
  ): DynamicModule {
    return {
      module: PluginCoreModule,
      imports: [PluginCoreInternalModule.forRootAsync(options)],
    };
  }
  public static forPlugin(
    options: PluginCoreModulePluginOptions
  ): DynamicModule {
    return {
      module: PluginCoreModule,
      providers: [
        {
          provide: PluginCoreServiceToken,
          inject: [PluginCoreModuleOptionsToken, PluginNameToken],
          useFactory: (
            options: PluginCoreInternalModuleRootOptions,
            pluginName: string
          ) => {
            return pluginName ? options.serviceFactory(pluginName) : null;
          },
          scope: Scope.REQUEST,
        },
        {
          provide: PluginNameToken,
          useValue: options.pluginName,
        },
      ],
      exports: [PluginCoreServiceToken],
    };
  }
}
