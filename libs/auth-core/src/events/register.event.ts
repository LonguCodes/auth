export namespace RegisterEvent {
  export const Name = 'register';
  export interface Payload {
    id: string;
    email: string;
    date: Date;
  }
}
