import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  AccessTokenResponseDto,
  ErrorResponseDto,
} from '@longucodes/auth-core';
import { GoogleLoginRequestDto } from '../request/google-login.request.dto';
import { GoogleOAuthService } from '../../domain/service/google-o-auth.service';
import { SocialLoginFailedError } from '../../domain/errors/social-login-failed.error';

@Controller('oAuth/google')
export class GoogleOAuthController {
  constructor(private readonly googleAuthService: GoogleOAuthService) {}

  @Post()
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
  public async login(@Body() credentials: GoogleLoginRequestDto) {
    return this.googleAuthService
      .login(credentials.code)
      .transform(AccessTokenResponseDto)
      .rethrowAs(SocialLoginFailedError, InternalServerErrorException);
  }
}
