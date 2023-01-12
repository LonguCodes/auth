import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokenResponseDto {
  @ApiProperty()
  @Expose()
  token: string;
}
