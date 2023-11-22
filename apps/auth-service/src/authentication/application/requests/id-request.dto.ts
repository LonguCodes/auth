import { IsJWT, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdRequestDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  id: string;
}
