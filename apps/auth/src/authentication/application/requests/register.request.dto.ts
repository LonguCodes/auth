import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CredentialsRequestDto } from './credentials.request.dto';

export class RegisterRequestDto extends CredentialsRequestDto {
  @ApiProperty()
  @IsObject()
  @IsOptional()
  additionalInformation: Record<string, any>;
}
