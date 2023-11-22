import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty()
  @Expose()
  token: string;
}
