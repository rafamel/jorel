import { TWhere } from './query';

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
  query(
    query?: IAdapterQuery<T>
  ): Promise<Array<TAdapterQueryResponse<T>> | void>;
}

export type TAdapterQueryResponse<T> = Partial<T> & { [key: string]: any };

export interface IAdapterWhere<T> {
  where?: TWhere<T>;
}
export interface IAdapterSelect<T> {
  /**
   * Selects all on `null`/`undefined`. Selects none on empty array.
   */
  select?: Array<keyof T & string> | null;
}
export interface IAdapterBatch<T> extends IAdapterSelect<T> {
  data: Array<Partial<T>>;
}
export interface IAdapterCreate<T> extends IAdapterSelect<T> {
  data: Partial<T>;
}
export interface IAdapterPatch<T> extends IAdapterSelect<T>, IAdapterWhere<T> {
  data: Partial<T>;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAdapterRemove<T> extends IAdapterWhere<T> {}
export interface IAdapterQuery<T> extends IAdapterSelect<T>, IAdapterWhere<T> {
  // TODO
  // paginate?: IPaginate<T>;
  // aggregate?: { [key: string]: IAdapterAggregate<T> };
}

export interface IAdapterAggregate<T> {
  fn: TAdapterAggregateFn;
  of: keyof T;
}
export type TAdapterAggregateFn = 'count' | 'min' | 'max' | 'sum' | 'avg';
