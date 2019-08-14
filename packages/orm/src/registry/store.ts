import { IOfType, TJqlEdges } from '~/types';
import { Collection, PureCollection } from '~/collection';
import { defaults as options } from '~/options';

export const collections: IOfType<typeof Collection> = {};
export const pure: IOfType<PureCollection<Collection>> = {};
export const edges: IOfType<TJqlEdges<any>> = {};

export default {
  collection(name: string): typeof Collection {
    if (options.sanity && !collections.hasOwnProperty(name)) {
      throw Error(`Collection ${name} is not in registry`);
    }
    return collections[name];
  },
  pure<T extends Collection>(name: string): PureCollection<T> {
    if (options.sanity && !pure.hasOwnProperty(name)) {
      throw Error(`Collection ${name} has not been registered`);
    }
    return pure[name] as PureCollection<any>;
  },
  edges<T extends Collection>(name: string): TJqlEdges<T> {
    if (options.sanity && !edges.hasOwnProperty(name)) {
      throw Error(`Collection ${name} has not been registered`);
    }
    return edges[name];
  }
};
