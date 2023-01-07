import {
  BadRequestException,
  Body,
  Controller,
  Post,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';
import { TokenRequestDto } from '../requests/token.request.dto';
import { AdminGuard } from '../../../admin/application/guard/admin.guard';
import { IdRequestDto } from '../requests/id-request.dto';
import { UserMissingError } from '../../domain/errors/user-missing.error';
import { UserAlreadyValidatedError } from '../../domain/errors/user-already-validated.error';
import { InvalidTokenError } from '../../../crypto/domain/error/invalid-token.error';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('validate/generate')
  @SetMetadata(AdminGuard.ADMIN_METADATA_KEY, true)
  public async generateValidationToken(@Body() { id }: IdRequestDto) {
    const token = await this.userService.generateValidationToken(id);
    return {
      token,
    };
  }

  @Post('validate')
  public async validate(@Body() { token }: TokenRequestDto) {
    await this.userService
      .validateUser(token)
      .rethrowAs(UserMissingError, BadRequestException)
      .rethrowAs(UserAlreadyValidatedError, BadRequestException)
      .rethrowAs(InvalidTokenError, UnauthorizedException);
  }
}
