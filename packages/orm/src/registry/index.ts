import { Collection, PureCollection } from '~/collection';
import { defaults as options } from '~/options';
import prepare from './prepare';
import store, { collections, pure, edges } from './store';

const registry = {
  add<T extends typeof Collection>(collection: T): T {
    prepare(collection);
    const name = collection.collection;
    if (options.sanity && collections.hasOwnProperty(name)) {
      throw Error(`A collection ${name} has already been registered`);
    }

    collections[name] = collection;
    pure[name] = new PureCollection(collection.adapter(name, collection.id));
    edges[name] = collection.edges
      ? Object.assign(
          {},
          collection.edges.one || {},
          collection.edges.many || {}
        )
      : {};

    return collection;
  },
  get(collection: string): typeof Collection {
    return store.collection(collection);
  },
  remove(collection: string | typeof Collection): void {
    const key: string =
      typeof collection === 'string' ? collection : collection.collection;

    if (options.sanity && !collections.hasOwnProperty(key)) {
      throw Error(`Collection ${key} is not in registry`);
    }

    delete collections[key];
    delete pure[key];
  }
};

export { registry as default, store };
