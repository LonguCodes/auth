export interface CustomRequest<TUser> extends Request {
  user: TUser;
}

export interface UserDto {
  id: string;
  email: string;
}
