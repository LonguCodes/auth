import { IsDefined, IsString, IsUUID } from 'class-validator';

export class UserRoleRequestDto {
  @IsDefined()
  @IsUUID(4)
  userId: string;

  @IsDefined()
  @IsString()
  role: string;
}
