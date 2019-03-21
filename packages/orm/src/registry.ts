import { IOfType } from './types';
import { Collection } from './collections';
import { defaults as options } from './options';
import { JorelError, EErrorTypes } from './errors';

const collections: IOfType<typeof Collection> = {};

export default {
  get(name: string): typeof Collection {
    if (options.sanity && !collections.hasOwnProperty(name)) {
      throw new JorelError({
        message: `Collection ${name} has not been initialized`,
        type: EErrorTypes.CollectionValidation
      });
    }
    return collections[name];
  },
  set<T extends typeof Collection>(collection: T): T {
    if (options.sanity && collections.hasOwnProperty(collection.collection)) {
      throw new JorelError({
        message: `A collection with name ${
          collection.collection
        } has already been initialized. Collection names must not collide.`,
        type: EErrorTypes.CollectionValidation
      });
    }
    return collection;
  }
};
