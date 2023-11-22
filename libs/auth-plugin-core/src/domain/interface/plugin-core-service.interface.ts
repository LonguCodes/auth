import { AccessTokenDto } from '@longucodes/auth-core';

export interface PluginCoreServiceInterface {
  getIdByEmail(email: string): Promise<string | undefined>;

  getClaim<T>(userId: string, propertyName: string): Promise<T>;

  setClaim<T>(userId: string, propertyName: string, value: T): Promise<void>;

  createUser(
    email: string,
    validated?: boolean,
    claims?: Record<string, unknown>
  ): Promise<string>;

  loginUser(userId: string): Promise<AccessTokenDto>;
}
