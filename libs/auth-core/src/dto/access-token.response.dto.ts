import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccessTokenResponseDto {
  @ApiProperty()
  @Expose()
  token: string;

  @ApiProperty()
  @Expose()
  renewToken: string;
}
