import { IsEmail, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CredentialsRequestDto } from './credentials.request.dto';

export class RegisterRequestDto extends CredentialsRequestDto {
  @ApiProperty()
  @IsObject()
  additionalInformation: Record<string, any>;
}
