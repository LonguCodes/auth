import { UserService } from '../../../user/domain/services/user.service';
import {
  PluginCoreServiceInterface,
  UserMissingError,
} from '@longucodes/auth-plugin-core';
import { AuthenticationService } from '../../../authentication/domain/services/authentication.service';
import { AccessTokenDto } from '@longucodes/auth-core';

export class PluginSupportService implements PluginCoreServiceInterface {
  constructor(
    private readonly pluginName: string,
    private readonly userService: UserService,
    private readonly authService: AuthenticationService
  ) {}

  public async getIdByEmail(email: string) {
    const user = await this.userService.getUserByEmail(email);
    return user?.id;
  }

  public async getClaim<T>(userId: string, propertyName: string): Promise<T> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new UserMissingError('User does not exist');
    if (!(this.pluginName in user.claims)) return undefined;
    return user.claims[this.pluginName][propertyName] as T;
  }

  public async setClaim<T>(userId: string, propertyName: string, value: T) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new UserMissingError('User does not exist');
    if (!(this.pluginName in user.claims)) user.claims[this.pluginName] = {};
    user.claims[this.pluginName][propertyName] = value;
    await this.userService.updateUser(user);
  }

  public async createUser(email: string, validated = false, claims = {}) {
    const user = await this.userService.createUser(
      { email, validated },
      claims
    );
    return user.id;
  }

  public async loginUser(userId: string): Promise<AccessTokenDto> {
    return this.authService.loginUser(userId);
  }
}
