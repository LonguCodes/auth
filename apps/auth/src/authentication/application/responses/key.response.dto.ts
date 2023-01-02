import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class KeyResponseDto {
  @ApiProperty()
  @Expose()
  key: string;
}
