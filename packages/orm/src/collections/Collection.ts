import { TConstructor, TAdapter } from '../types';
import PureCollection from './PureCollection';
import { JSONSchema7 } from 'json-schema';

/**
 * Collections can extend other collections classes, as long as these classes are abstract: non-abstract `Collection` classes MUST NOT be extended. Put another way, any `Collection` that might get intialized (see `Collection.initialize()`) must not be extended.
 */
export default class Collection {
  // TODO
  /**
   * Sets whether `@jorel/loader` (think *dataloader*) will be active. Default: `true`.
   */
  public static loader: boolean = true;
  // TODO
  /**
   * Controls whether all `create` and `update` data gets validated against the JSONSchema. Default: `true`.
   */
  public static validate: boolean = true;
  // TODO
  /**
   * Controls whether all previous data is prefetched on static `update` and `patch` calls. It is common that `before` hooks require previous data to be available. This will imply an additional query will be done to fetch the previous data before an patch or update. Default: `false`.
   */
  public static prefetch: boolean = false;
  /**
   * Adapter to use on a collection
   */
  public static adapter: TAdapter<any>;
  /**
   * Collection name/table.
   */
  public static collection: string;
  /**
   * Signals the field that contains the unique identifier for all instances/rows of a collection.
   */
  public static id: string;
  // TODO
  /**
   * Overwrites schema properties inference for instance property getters.
   */
  public static properties: string[];
  // TODO
  /**
   * JSONSchema definition for each instance/row data. In order for collection instances to work properly, a schema MUST declare all first level fields (properties) for saved data, even if no type declaration for these is set. It must be coherent with recorded data.
   */
  public static schema: JSONSchema7;
  /**
   * Returns a `PureCollection` for a `Collection`
   */
  public static pure<T extends Collection>(
    this: TConstructor<T> & typeof Collection
  ): PureCollection<T> {
    throw Error();
  }
  /**
   * Initializes and verifies a collection, initializes the adapter for the collection, and sets getters for each instance data property, according to `Collection.schema` JSONSchema `properties`.
   */
  public static initialize<T extends typeof Collection>(this: T): T {
    throw Error();
  }

  // Instance
  public raw: any;
}
