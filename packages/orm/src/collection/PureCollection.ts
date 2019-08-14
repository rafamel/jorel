import {
  IAdapterBatch,
  IAdapter,
  IAdapterCreate,
  IAdapterPatch,
  IAdapterQuery,
  IAdapterRemove
} from '../types';
import { PureAgent } from '../agents';
import Collection from './Collection';
import { QueryError } from '~/errors';

// TODO add hooks
/**
 * A `PureCollection` is created on every `Collection` initialization. It provides a lower level interface for queries, allowing for more fine-grained control, with arguments equivalent to those taken by adapters, and returning plain objects instead of collection instances. Keep in mind you can't do nested mutation or querying operations with this api.
 */
export default class PureCollection<T extends Collection> {
  public adapter: IAdapter<T>;
  public constructor(adapter: IAdapter<T>) {
    this.adapter = adapter;
  }
  /**
   * Batch inserts records.
   */
  public batch(
    query: IAdapterBatch<T>
  ): PureAgent<Partial<T>, Promise<Array<Partial<T>> | void>> {
    return new PureAgent(() => {
      return this.adapter.batch(query).catch(async (err) => {
        throw new QueryError('ExecutionError', { err });
      });
    });
  }
  /**
   * Inserts record.
   */
  public create(
    query: IAdapterCreate<T>
  ): PureAgent<Partial<T>, Promise<Partial<T> | void>> {
    return new PureAgent(() => {
      return this.adapter.create(query).catch(async (err) => {
        throw new QueryError('ExecutionError', { err });
      });
    });
  }
  /**
   * Updates records.
   */
  public update(
    query: IAdapterPatch<T>
  ): PureAgent<Partial<T>, Promise<Array<Partial<T>> | void>> {
    return new PureAgent(() => {
      return this.adapter.patch(query).catch(async (err) => {
        throw new QueryError('ExecutionError', { err });
      });
    });
  }
  /**
   * Patches records.
   */
  public patch(
    query: IAdapterPatch<T>
  ): PureAgent<Partial<T>, Promise<Array<Partial<T>> | void>> {
    return new PureAgent(() => {
      return this.adapter.patch(query).catch(async (err) => {
        throw new QueryError('ExecutionError', { err });
      });
    });
  }
  /**
   * Removes records.
   */
  public remove(query?: IAdapterRemove<T>): PureAgent<void, Promise<void>> {
    return new PureAgent(() => {
      return this.adapter.remove(query).catch(async (err) => {
        throw new QueryError('ExecutionError', { err });
      });
    });
  }
  /**
   * Queries database.
   */
  public query(
    query?: IAdapterQuery<T>
  ): PureAgent<Partial<T>, Promise<Array<Partial<T>> | void>> {
    return new PureAgent(() => {
      return this.adapter.query(query).catch(async (err) => {
        throw new QueryError('ExecutionError', { err });
      });
    });
  }
}
