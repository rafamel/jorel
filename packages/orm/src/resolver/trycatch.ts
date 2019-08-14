import { Collection } from '~/collection';
import { QueryError } from '~/errors';
import { TQueryResponse, IConstructor } from '~/types';

export default async function trycatch<T, P>(
  collection: IConstructor<T> & typeof Collection,
  path: string[],
  fn: () => Promise<TQueryResponse<P>>
): Promise<TQueryResponse<T | P>> {
  try {
    return fn();
  } catch (err) {
    const error = new QueryError('QueryError', { err });
    if (!error.first.path) error.first.path = path;

    return {
      collection,
      error: error.first
    };
  }
}
