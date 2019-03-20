import Knex from 'knex';
import {
  IAdapter,
  IAdapterQuery,
  IAdapterCreate,
  IAdapterBatch,
  IAdapterRemove,
  TAdapterQueryResponse,
  IAdapterPatch
} from '@jorel/orm';
import { returnSelectOne } from './return-select';

export default class SqlAdapter<T> implements IAdapter<T> {
  public knex: Knex;
  public collection: string;
  public id: string;
  public maxBatch: number;
  public isPostgres: boolean;
  public constructor(
    knex: Knex,
    collection: string,
    id: string,
    maxBatch: number
  ) {
    this.knex = knex;
    this.collection = collection;
    this.id = id;
    this.maxBatch = maxBatch;
    this.isPostgres = (knex as any)._context.client.config.client === 'pg';
  }
  /**
   * Returns a Knex query builder for the collection table
   */
  public builder(): Knex.QueryBuilder {
    return this.knex(this.collection);
  }
  public async batch(
    query: IAdapterBatch<T>
  ): Promise<Array<Partial<T>> | void> {
    // TODO: implement & test for maxBatch
    throw Error();
  }
  public async create(query: IAdapterCreate<T>): Promise<Partial<T> | void> {
    return returnSelectOne.call(
      this,
      this.builder().insert(query.data),
      query.select
    );
  }
  public async patch(
    query: IAdapterPatch<T>
  ): Promise<Array<Partial<T>> | void> {
    throw Error();
  }
  public async remove(query?: IAdapterRemove<T>): Promise<void> {
    throw Error();
  }
  public async query(
    query?: IAdapterQuery<T>
  ): Promise<Array<TAdapterQueryResponse<T>> | void> {
    throw Error();
}
