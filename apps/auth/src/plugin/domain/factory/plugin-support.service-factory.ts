import { Injectable } from '@nestjs/common';
import { UserService } from '../../../user/domain/services/user.service';
import { PluginSupportService } from '../service/plugin-support.service';
import { AuthenticationService } from '../../../authentication/domain/services/authentication.service';

@Injectable()
export class PluginSupportServiceFactory {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthenticationService
  ) {}

  public create(pluginName: string) {
    return new PluginSupportService(
      pluginName,
      this.userService,
      this.authService
    );
  }
}
