import { Controller, Get, Logger } from '@nestjs/common';
import { Public } from '@longucodes/nest-auth';
import { Roles } from '../../../../libs/nestjs-auth/src/auth/application/decorator/require-role.decorator';

@Controller('welcome')
export class WelcomeController {
  @Get('public')
  @Public()
  public async forEveryone() {
    Logger.verbose('Public endpoint accessed');
    return {
      accessed: true,
    };
  }

  @Get('non-public')
  public async forLoggedIn() {
    Logger.verbose('Non-public endpoint accessed');
    return {
      accessed: true,
    };
  }

  @Get('admin')
  @Roles('admin')
  public async forAdmins() {
    Logger.verbose('Admin-only endpoint accessed');
    return {
      accessed: true,
    };
  }

  @Get('superadmin')
  @Roles('superadmin')
  public async forSuperadmins() {
    Logger.verbose('Superadmin-only endpoint accessed');
    return {
      accessed: true,
    };
  }
}
