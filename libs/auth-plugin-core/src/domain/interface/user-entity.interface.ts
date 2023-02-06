import { AccessTokenDto } from '@longucodes/auth-core';

export interface PluginCoreServiceInterface {
  getIdByEmail(email: string): Promise<string | undefined>;

  getProperty<T>(userId: string, propertyName: string): Promise<T>;

  setProperty<T>(userId: string, propertyName: string, value: T): Promise<void>;

  createUser(email: string, validated?: boolean): Promise<string>;

  loginUser(userId: string): Promise<AccessTokenDto>;
}
