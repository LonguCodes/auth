import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ required: true })
  message?: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: string;
}
