import { IsJWT, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordChangeRequestDto {
  @ApiProperty()
  @IsString()
  @IsJWT()
  token: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}
