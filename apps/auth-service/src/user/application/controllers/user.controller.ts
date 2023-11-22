import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';
import { TokenRequestDto } from '../requests/token.request.dto';
import { IdRequestDto } from '../requests/id-request.dto';
import { UserMissingError } from '../../domain/errors/user-missing.error';
import { UserAlreadyValidatedError } from '../../domain/errors/user-already-validated.error';
import { InvalidTokenError } from '../../../crypto/domain/error/invalid-token.error';
import { Admin } from '../../../admin/application/decorator/admin.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { TokenResponseDto } from '../../../common/dto';
import { ErrorResponseDto } from '@longucodes/auth-core';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('validate/generate')
  @ApiResponse({
    status: 200,
    type: TokenResponseDto,
    description: 'Generated validation token',
  })
  @ApiResponse({
    status: 404,
    description: 'User does not exist',
    type: ErrorResponseDto,
  })
  @Admin()
  public async generateValidationToken(@Body() { id }: IdRequestDto) {
    return this.userService
      .generateValidationToken(id)
      .wrap('token')
      .transform(TokenResponseDto)
      .rethrowAs(UserMissingError, NotFoundException);
  }

  @Post('validate')
  @ApiResponse({
    status: 200,
    description: 'User successfully validated',
  })
  @ApiResponse({
    status: 404,
    description: 'User does not exist',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User already validated',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
    type: ErrorResponseDto,
  })
  public async validate(@Body() { token }: TokenRequestDto) {
    await this.userService
      .validateUser(token)
      .rethrowAs(UserMissingError, NotFoundException)
      .rethrowAs(UserAlreadyValidatedError, BadRequestException)
      .rethrowAs(InvalidTokenError, UnauthorizedException);
  }
}
