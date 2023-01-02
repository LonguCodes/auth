import { Body, Controller, Post, SetMetadata } from '@nestjs/common';
import { AdminGuard } from '../guard/admin.guard';
import { UserRoleRequestDto } from '../request/user-role.request.dto';
import { UserService } from '../../../authentication/domain/services/user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenResponseDto } from '../../../authentication/application/responses/token.response.dto';
import { ErrorResponseDto } from '../../../common/dto/error.response.dto';

@Controller('admin')
@SetMetadata(AdminGuard.ADMIN_METADATA_KEY, true)
@ApiTags('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 201,
    description: 'Role added to user',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: ErrorResponseDto,
  })
  @Post('role-add')
  public async addRole(@Body() dto: UserRoleRequestDto) {
    await this.userService.addUserRole(dto.userId, dto.role);
  }

  @ApiResponse({
    status: 201,
    description: 'Role removed from user',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: ErrorResponseDto,
  })
  @Post('role-remove')
  public async removeRole(@Body() dto: UserRoleRequestDto) {
    await this.userService.removeUserRole(dto.userId, dto.role);
  }
}
