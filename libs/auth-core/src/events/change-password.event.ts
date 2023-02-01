export namespace ChangePasswordEvent {
  export const Name = 'changePassword';
  export interface Payload {
    id: string;
    email: string;
    date: Date;
  }
}
