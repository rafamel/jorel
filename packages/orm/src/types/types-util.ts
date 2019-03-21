export { Omit } from 'utility-types';

export type TConstructor<T = {}> = (new (...args: any[]) => T) & {
  [key: string]: any;
};

export type TElementType<T> = T extends Array<infer U> ? U : T;

export interface IOfType<T> {
  [key: string]: T;
}
