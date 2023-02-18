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
    return user && user.id;
  }

  public async getProperty<T>(userId: string, propertyName: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new UserMissingError('User does not exist');
    if (!(this.pluginName in user.pluginProperties)) return undefined;
    return user.pluginProperties[this.pluginName][propertyName];
  }

  public async setProperty<T>(userId: string, propertyName: string, value: T) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new UserMissingError('User does not exist');
    if (!(this.pluginName in user.pluginProperties))
      user.pluginProperties[this.pluginName] = {};
    user.pluginProperties[this.pluginName][propertyName] = value;
    await this.userService.updateUser(user);
  }

  public async createUser(
    email: string,
    validated = false,
    additionalInformation = {}
  ) {
    const user = await this.userService.createUser(
      { email, validated },
      additionalInformation
    );
    return user.id;
  }

  public async loginUser(userId: string): Promise<AccessTokenDto> {
    return this.authService.loginUser(userId);
  }
}
