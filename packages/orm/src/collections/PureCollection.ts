import {
  IAdapterBatch,
  IAdapter,
  IAdapterCreate,
  IAdapterPatch,
  IAdapterQuery,
  TConstructor,
  TAdapterQueryResponse,
  IAdapterRemove
} from '../types';
import { PureAgent } from '../agents';
import Collection from './Collection';

// TODO add hooks
/**
 * A `PureCollection` is created on every `Collection` initialization. It provides a lower level interface for queries, allowing for more fine-grained control, with arguments equivalent to those taken by adapters, and returning plain objects instead of collection instances. Keep in mind you can't do nested mutation or querying operations with this api.
 */
export default class PureCollection<T extends Collection> {
  /** The `Collection` this `PureCollection` is linked to */
  public collection: TConstructor<T> & typeof Collection;
  /** A built adapter */
  public adapter: IAdapter<T>;
  public constructor(collection: TConstructor<T> & typeof Collection) {
    this.collection = collection;
    this.adapter = collection.adapter(collection.collection, collection.id);
  }
  /**
   * Batch inserts records.
   */
  public batch(
    query: IAdapterBatch<T>
  ): PureAgent<Partial<T>, Promise<Array<Partial<T>> | void>> {
    return new PureAgent(() => this.adapter.batch(query));
  }
  /**
   * Inserts record.
   */
  public create(
    query: IAdapterCreate<T>
  ): PureAgent<Partial<T>, Promise<Partial<T> | void>> {
    return new PureAgent(() => this.adapter.create(query));
  }
  /**
   * Updates records.
   */
  public update(
    query: IAdapterPatch<T>
  ): PureAgent<Partial<T>, Promise<Array<Partial<T>> | void>> {
    return new PureAgent(() => this.adapter.patch(query));
  }
  /**
   * Patches records.
   */
  public patch(
    query: IAdapterPatch<T>
  ): PureAgent<Partial<T>, Promise<Array<Partial<T>> | void>> {
    return new PureAgent(() => this.adapter.patch(query));
  }
  /**
   * Removes records.
   */
  public remove(query?: IAdapterRemove<T>): PureAgent<void, Promise<void>> {
    return new PureAgent(() => this.adapter.remove(query));
  }
  /**
   * Queries database.
   */
  public query(
    query?: IAdapterQuery<T>
  ): PureAgent<
    TAdapterQueryResponse<T>,
    Promise<Array<TAdapterQueryResponse<T>> | void>
  > {
    return new PureAgent(() => this.adapter.query(query));
  }
}
