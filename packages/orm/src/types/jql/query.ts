import { TElementType, Omit } from '../types-util';

export interface IJqlBasicQuery<T> {
  where?: TJqlWhere<T>;
  paginate?: IJqlPaginate<T>;
}

export interface IJqlQuery<T> extends IJqlBasicQuery<T> {
  edges?: TJqlQueryEdges<T>;
}

export type TJqlQueryEdges<T> = {
  [P in keyof T]?: TJqlQueryEdge<TElementType<T[P]>>
};

export type TJqlQueryEdge<T> = boolean | undefined | null | IJqlQuery<T>;

export interface IJqlPaginate<T> {
  skip?: number;
  limit?: number;
  order?: IJqlOrder<T> | Array<IJqlOrder<T>>;
}
export interface IJqlOrder<T> {
  by: keyof T;
  desc?: boolean;
}

export type TJqlWhere<T> =
  | IJqlWhereAnd<T>
  | IJqlWhereOr<T>
  | TJqlWhereValues<T>;

/**
 * Defines fields that can be queried for a type
 */
export type TJqlWhereValues<T> = { [P in keyof T]?: IJqlWhereEquality<T[P]> } &
  IWhereForbidden;

export interface IJqlWhereAnd<T> extends Omit<IWhereForbidden, '$and'> {
  $and: Array<TJqlWhere<T>>;
}

export interface IJqlWhereOr<T> extends Omit<IWhereForbidden, '$or'> {
  $or: Array<TJqlWhere<T>>;
}

/**
 * Query equality operators
 */
export interface IJqlWhereEquality<V> {
  $eq?: V;
  $ne?: V;
  $gte?: V;
  $gt?: V;
  $lte?: V;
  $lt?: V;
  $in?: V[];
  $nin?: V[];
}

interface IWhereForbidden {
  $and?: null;
  $or?: null;
}
