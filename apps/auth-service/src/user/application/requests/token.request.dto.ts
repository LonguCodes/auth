import { IsJWT, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenRequestDto {
  @ApiProperty()
  @IsString()
  @IsJWT()
  token: string;
}
