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
import parseWhere from './parse-where';
import { returnSelectOne, returnSelectMany } from './return-select';

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

    if (this.isPostgres) {
      return query.select && !query.select.length
        ? this.builder()
            .insert(query.data)
            .then(() => {})
        : this.builder()
            .insert(query.data)
            .returning(query.select || '*');
    }

    // If no postgres, iterate over create
    let promises: Array<PromiseLike<any>> = [];
    let error: Error;
    for (let item of query.data) {
      promises.push(
        this.builder()
          .insert(item)
          .then((arr) => arr[0])
          .catch((e) => {
            if (!error) error = e;
            return null;
          })
      );
    }
    return Promise.all(promises).then(async (ids) => {
      if (error) {
        // Undo successful inserts
        await this.remove({ where: { [this.id]: { $in: ids } } })
          // Swallow removal error
          .catch(() => {});
        throw error;
      }

      return returnSelectMany.call(this, ids, query.select);
    });
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
    let builder = parseWhere(this.builder(), query.where);

    if (this.isPostgres) {
      return query.select && !query.select.length
        ? builder.update(query.data).then(() => {})
        : builder.update(query.data).returning(query.select || '*');
    }

    if (query.select && !query.select.length) {
      // No returnning data selected
      return builder.update(query.data).then(() => {});
    }
    // Some returning data selected
    // As the { where } query might not work any further,
    // we need to query the data beforehand
    // and merge it afterwards
    const selectIncludesId =
      !query.select || query.select.includes(this.id as any);
    const rows: any[] = await (query.select
      ? builder.select(
          selectIncludesId ? query.select : query.select.concat(this.id as any)
        )
      : builder.select());

    // Do actual patching
    const ids: any[] = rows.map((x: any) => x[this.id]);
    await this.builder()
      .whereIn(this.id, ids)
      .update(query.data);

    const dataToMerge = query.select
      ? query.select.reduce((acc: any, key: string) => {
          if (query.data.hasOwnProperty(key)) {
            acc[key] = (query.data as any)[key];
          }
          return acc;
        }, {})
      : query.data;
    return selectIncludesId
      ? rows.map((item) => ({ ...item, ...dataToMerge }))
      : rows.map((item) => {
          delete item[this.id];
          return { ...item, ...dataToMerge };
        });
  }
  public async remove(query?: IAdapterRemove<T>): Promise<void> {
    await parseWhere(this.builder(), query && query.where).del();
  }
  public async query(
    query?: IAdapterQuery<T>
  ): Promise<Array<TAdapterQueryResponse<T>> | void> {
    if (query && query.select && !query.select.length) return;

    let builder = this.builder();

    // Select
    builder =
      query && query.select ? builder.select(query.select) : builder.select();

    // Where
    builder = parseWhere(builder, query && query.where);

    return builder;
  }
}
