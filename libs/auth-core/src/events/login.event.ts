export namespace LoginEvent {
  export const Name = 'login';
  export interface Payload {
    id: string;
    email: string;
    date: Date;
  }
}
