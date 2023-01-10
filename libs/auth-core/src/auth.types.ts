import { FactoryProvider } from '@nestjs/common';

export interface CustomRequest<TUser> extends Request {
  user: TUser;
}
export type ModuleOptionsFactory<T> = Omit<
  FactoryProvider<T extends { global: boolean } ? Omit<T, 'global'> : T>,
  'provide' | 'scope' | 'durable'
> & { global?: boolean };

export interface UserDto {
  id: string;
  email: string;

  roles: string[];
}
