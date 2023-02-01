import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordChangeTokenGenerateRequestDto {
  @ApiProperty()
  @IsString()
  @IsUUID(4)
  id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  oldPassword?: string;
}
