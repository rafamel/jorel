export { Omit } from 'utility-types';

export interface IConstructor<T> {
  new (...args: any[]): T;
  prototype: T;
}

export type TElementType<T> = T extends Array<infer U> ? U : T;

export interface IOfType<T> {
  [key: string]: T;
}
