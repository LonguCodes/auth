export namespace RegisterEvent {
  export const Name = 'register';
  export interface Payload<T extends Record<string, unknown> = null> {
    id: string;
    email: string;
    date: Date;
    validated: boolean;
    claims: T;
  }
}
