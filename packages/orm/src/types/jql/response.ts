import { QueryError } from '~/errors';
import { Collection } from '~/collection';
import { IConstructor, Omit } from '../types-util';

// export interface IMutationResponse {
//   mutations: {
//     [key: string]: QueryError;
//   };
//   queries: {
//     [key: string]: IQueryResponse<any>;
//   };
// }

export type TQueryResponse<T> = IQuerySuccess<T> | IQueryError<T>;

type TAllowedSuccess = Omit<IForbidden, 'collection' | 'info' | 'items'>;
export interface IQuerySuccess<T> extends TAllowedSuccess {
  collection: typeof Collection;
  info: IQueryInfo;
  items: Array<IRawItem<T>>;
}

type TAllowedError = Omit<IForbidden, 'collection' | 'error'>;
export interface IQueryError<T> extends TAllowedError {
  collection: IConstructor<T> & typeof Collection;
  error: QueryError;
}

export interface IQueryInfo {
  next: boolean;
  previous: boolean;
}

export interface IRawItem<T> {
  data: T;
  edges?: { [P in keyof T]?: TQueryResponse<T[P]> };
}

interface IForbidden {
  collection?: null;
  info?: null;
  items?: null;
  error?: null;
}
