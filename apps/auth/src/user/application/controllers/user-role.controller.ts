import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../../../libs/auth-core/src/dto/error.response.dto';
import { UserRoleRequestDto } from '../requests/user-role.request.dto';
import { Admin } from '../../../admin/application/decorator/admin.decorator';

@Controller('user/role')
@Admin()
export class UserRoleController {
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
  @Post('add')
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
  @Post('remove')
  public async removeRole(@Body() dto: UserRoleRequestDto) {
    await this.userService.removeUserRole(dto.userId, dto.role);
  }
}
