export namespace ValidatedEvent {
  export const Name = 'validated';
  export interface Payload {
    id: string;
    email: string;
    date: Date;
  }
}
