export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
export type Value<T extends object, TKey extends keyof T> = T[TKey];
