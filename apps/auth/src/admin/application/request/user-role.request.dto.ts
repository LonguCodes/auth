import { IsString, IsUUID } from 'class-validator';

export class UserRoleRequestDto {
  @IsUUID(4)
  userId: string;

  @IsString()
  role: string;
}
