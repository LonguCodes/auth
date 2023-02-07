import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginRequestDto {
  @ApiProperty()
  @IsString()
  code: string;
}
