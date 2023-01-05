export namespace ChangeRoleEvent {
  export const Name = 'changeRole';
  export interface Payload {
    id: string;
    email: string;
    date: Date;
    previousRoles: string[];
    currentRoles: string[];
  }
}
