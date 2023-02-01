import { IsJWT, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordChangeTokenGenerateRequestDto {
  @ApiProperty()
  @IsString()
  @IsJWT()
  id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  oldPassword?: string;
}
