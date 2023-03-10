import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from '../../domain/services/authentication.service';
import { CredentialsRequestDto } from '../requests/credentials.request.dto';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { DuplicateEmailError } from '../../domain/errors/duplicate-email.error';
import { TokenRequestDto } from '../requests/token.request.dto';
import { InvalidTokenError } from '../../domain/errors/invalid-token.error';
import { InvalidTokenError as CryptoInvalidTokenError } from '../../../crypto/domain/error/invalid-token.error';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ErrorResponseDto,
  AccessTokenResponseDto,
} from '@longucodes/auth-core';
import { KeyResponseDto } from '../responses/key.response.dto';
import {
  CryptoKeys,
  CryptoKeysToken,
} from '../../../crypto/domain/token/keys.token';
import { RegisterRequestDto } from '../requests/register.request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authorizationService: AuthenticationService,
    @Inject(CryptoKeysToken) private readonly cryptoKeys: CryptoKeys
  ) {}

  @ApiResponse({
    status: 200,
    type: AccessTokenResponseDto,
    description: 'Logged in successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Failed to log in',
    type: ErrorResponseDto,
  })
  @Post('login')
  public async login(@Body() dto: CredentialsRequestDto) {
    return this.authorizationService
      .loginUsingCredentials(dto)
      .transform(AccessTokenResponseDto)
      .rethrowAs(InvalidCredentialsError, UnauthorizedException);
  }

  @ApiResponse({
    status: 200,
    type: AccessTokenResponseDto,
    description: 'Logged in successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Failed to log in',
    type: ErrorResponseDto,
  })
  @Post('register')
  public async register(@Body() dto: RegisterRequestDto) {
    return this.authorizationService
      .register(dto)
      .transform(AccessTokenResponseDto)
      .rethrowAs(InvalidCredentialsError, UnauthorizedException)
      .rethrowAs(DuplicateEmailError, BadRequestException);
  }

  @ApiResponse({
    status: 200,
    type: AccessTokenResponseDto,
    description: 'Logged in successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Failed to log in',
    type: ErrorResponseDto,
  })
  @Post('renew')
  public async renewSession(@Body() dto: TokenRequestDto) {
    return this.authorizationService
      .renewToken(dto.token)
      .transform(AccessTokenResponseDto)
      .rethrowAs(InvalidTokenError, UnauthorizedException)
      .rethrowAs(CryptoInvalidTokenError, UnauthorizedException);
  }

  @ApiResponse({
    status: 200,
    type: KeyResponseDto,
  })
  @Get('public')
  public async getPublicKey() {
    return { key: this.cryptoKeys.public };
  }
}
