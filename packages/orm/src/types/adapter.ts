import { TJqlWhere, IJqlPaginate } from './jql';

/**
 * `TAdapter` defines the interface all adapters must implement. A valid adapter must (will) pass the `@jorel/compliance` tests for adapters.
 */
export type TAdapter<T> = (
  collection: string,
  id: keyof T & string
) => IAdapter<T>;

/**
 * Methods taking in a `select` query field will return void when no fields are selected.
 */
export interface IAdapter<T> {
  [key: string]: any;
  /**
   * Batch inserts records.
   */
  batch(query: IAdapterBatch<T>): Promise<Array<Partial<T>> | void>;
  /**
   * Inserts record.
   */
  create(query: IAdapterCreate<T>): Promise<Partial<T> | void>;
  /**
   * Patches records.
   */
  patch(query: IAdapterPatch<T>): Promise<Array<Partial<T>> | void>;
  /**
   * Removes records.
   */
  remove(query?: IAdapterRemove<T>): Promise<void>;
  /**
   * Queries database.
   */
  find(query?: IAdapterQuery<T>): Promise<Array<Partial<T>> | void>;
}

/**
 * Selects all on `null`/`undefined`. Selects none on empty array.
 */
export type TAdapterSelect<T> = Array<keyof T & string> | null;

export interface IAdapterBatch<T> {
  select?: TAdapterSelect<T>;
  data: Array<Partial<T>>;
}
export interface IAdapterCreate<T> {
  select?: TAdapterSelect<T>;
  data: Partial<T>;
}
export interface IAdapterPatch<T> {
  select?: TAdapterSelect<T>;
  where?: TJqlWhere<T>;
  data: Partial<T>;
}
export interface IAdapterRemove<T> {
  where?: TJqlWhere<T>;
}
export interface IAdapterQuery<T> {
  select?: TAdapterSelect<T>;
  where?: TJqlWhere<T>;
  // TODO
  paginate?: IJqlPaginate<T>;
  // aggregate?: { [key: string]: IAdapterAggregate<T> };
}

export interface IAdapterAggregate<T> {
  fn: TAdapterAggregateFn;
  of: keyof T;
}
export type TAdapterAggregateFn = 'count' | 'min' | 'max' | 'sum' | 'avg';
