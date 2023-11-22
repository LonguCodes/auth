export interface IUserEntity {
  id: string;
  email: string;
  validated: boolean;
  claims: Record<string, Record<string, unknown>>;
}
