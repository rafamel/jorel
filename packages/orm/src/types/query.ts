import { TElementType } from './types-util';

export interface IQuery<T> {
  where?: TWhere<T>;
  // TODO
  // paginate: IPaginate<T>,
  edges?: TQueryEdges<T>;
}

export type TQueryEdges<T> = {
  [P in keyof T]?: TQueryEdge<TElementType<T[P]>>
};

export type TQueryEdge<T> = boolean | undefined | null | TQueryEdges<T>;

export interface IPaginate<T> {
  first?: number;
  skip?: number;
  limit?: number;
  order?: IOrder<T> | Array<IOrder<T>>;
}
export interface IOrder<T> {
  by: keyof T;
  desc?: boolean;
}

export type TWhere<T> = IWhereLogical<T> | TWhereValues<T>;

/**
 * Defines fields that can be queried for a type
 */
export type TWhereValues<T> = { [P in keyof T]?: IWhereEquality<T[P]> };

export interface IWhereLogical<T> {
  $and?: Array<TWhere<T>>;
  $or?: Array<TWhere<T>>;
}

/**
 * Query equality operators
 */
export interface IWhereEquality<V> {
  $eq?: V;
  $ne?: V;
  $gte?: V;
  $gt?: V;
  $lte?: V;
  $lt?: V;
  $in?: V[];
  $nin?: V[];
}
