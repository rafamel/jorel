import { TJqlWhere, TJqlQueryEdge } from './query';
import { Omit, TElementType, IOfType } from '../types-util';
import { Collection } from '~/collections';

export type TJqlMutateOperation<T> =
  | IJqlCreate<T>
  | IJqlUpsert<T>
  | IJqlUpdate<T>
  | IJqlPatch<T>
  | IJqlRemove<T>
  | IJqlNested<T>;

export type TJqlMutate<T> = Partial<T> & TJqlNested<T>;

export type TJqlNested<T> = {
  [P in keyof T]?:
    | TJqlMutateOperation<TElementType<T[P]>>
    | Array<TJqlMutateOperation<TElementType<T[P]>>>
};

export type TJqlEdges<T> = IOfType<
  IJqlEdgeDefinition<T> | Array<IJqlEdgeDefinition<any>>
>;

export interface IJqlEdgeDefinition<T> {
  from: keyof T;
  to: any;
  at: typeof Collection;
}

type TAllowedCreate = Omit<IForbidden, 'create' | 'query' | 'edges'>;
export interface IJqlCreate<T> extends TAllowedCreate {
  query?: TJqlQueryEdge<T>;
  edges?: TJqlEdges<T>;
  create: TJqlMutate<T> | Array<TJqlMutate<T>>;
}

type TAllowedUpsert = Omit<
  IForbidden,
  'upsert' | 'unique' | 'where' | 'query' | 'edges'
>;
export interface IJqlUpsert<T> extends TAllowedUpsert {
  // TODO
  unique?: Array<keyof T | Array<keyof T>>;
  where?: TJqlWhere<T>;
  query?: TJqlQueryEdge<T>;
  edges?: TJqlEdges<T>;
  upsert: TJqlMutate<T> | Array<TJqlMutate<T>>;
}

type TAllowedUpdate = Omit<IForbidden, 'update' | 'where' | 'query' | 'edges'>;
export interface IJqlUpdate<T> extends TAllowedUpdate {
  where?: TJqlWhere<T>;
  query?: TJqlQueryEdge<T>;
  edges?: TJqlEdges<T>;
  update: TJqlMutate<T>;
}

type TAllowedPatch = Omit<IForbidden, 'patch' | 'where' | 'query' | 'edges'>;
export interface IJqlPatch<T> extends TAllowedPatch {
  where?: TJqlWhere<T>;
  query?: TJqlQueryEdge<T>;
  edges?: TJqlEdges<T>;
  patch: TJqlMutate<T>;
}

type TAllowedRemove = Omit<IForbidden, 'remove' | 'where' | 'edges'>;
export interface IJqlRemove<T> extends TAllowedRemove {
  where?: TJqlWhere<T>;
  edges?: TJqlEdges<T>;
  remove: boolean | TJqlNested<T>;
}

type TAllowedNested = Omit<IForbidden, 'nested' | 'where' | 'edges'>;
export interface IJqlNested<T> extends TAllowedNested {
  where?: TJqlWhere<T>;
  edges?: TJqlEdges<T>;
  nested: TJqlMutate<T>;
}

interface IForbidden {
  // Operation type
  create?: null;
  upsert?: null;
  update?: null;
  patch?: null;
  remove?: null;
  nested?: null;
  // Operation arguments
  unique?: null;
  where?: null;
  query?: null;
  edges?: null;
}
