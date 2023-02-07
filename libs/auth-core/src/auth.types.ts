import { FactoryProvider } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';

export interface CustomRequest<TUser> extends Request {
  user: TUser;
}
export type ModuleOptionsFactory<T> = Omit<
  FactoryProvider<T extends { global: boolean } ? Omit<T, 'global'> : T>,
  'provide' | 'scope' | 'durable'
> & { global?: boolean };

export type ModuleOptionsFactoryWithImports<T> = ModuleOptionsFactory<T> & {
  imports?: ModuleMetadata['imports'];
};

export interface UserDto {
  id: string;
  email: string;

  roles: string[];
}
