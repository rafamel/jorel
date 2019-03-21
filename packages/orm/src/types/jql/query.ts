import { TElementType, Omit } from '../types-util';

export interface IJqlQuery<T> {
  where?: TJqlWhere<T>;
  // TODO
  // paginate: IPaginate<T>,
  edges?: TJqlQueryEdges<T>;
}

export type TJqlQueryEdges<T> = {
  [P in keyof T]?: TJqlQueryEdge<TElementType<T[P]>>
};

export type TJqlQueryEdge<T> = boolean | undefined | null | TJqlQueryEdges<T>;

export interface IJqlPaginate<T> {
  skip?: number;
  limit?: number;
  // TODO
  // order?: IOrder<T> | Array<IOrder<T>>;
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
