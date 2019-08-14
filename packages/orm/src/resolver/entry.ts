import { IConstructor, TQueryResponse } from '~/types';
import { QueryContext } from '~/context';
import { Collection } from '~/collection';
import trycatch from './trycatch';

export interface IResolveEntryArgs<T> {
  collection: IConstructor<T> & typeof Collection;
  context?: QueryContext;
  path?: string[];
}

export default async function entry<T, A extends IResolveEntryArgs<T>, O>(
  args: A,
  opts: O,
  fn: (
    args: A & Required<IResolveEntryArgs<T>>,
    opts: Partial<NonNullable<O>>
  ) => Promise<TQueryResponse<any>>
): Promise<TQueryResponse<any>> {
  const path = args.path || [];
  return trycatch(args.collection, path, () => {
    const context = args.context || new QueryContext();
    return fn({ ...args, path, context }, opts || {});
  });
}
