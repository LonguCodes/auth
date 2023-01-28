export interface EventDto<T = object> {
  name: string;
  payload: T;
}
