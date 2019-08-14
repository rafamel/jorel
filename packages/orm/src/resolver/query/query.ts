import { Collection } from '~/collection';
import { IJqlQuery, IOfType, TQueryResponse, IJqlBasicQuery } from '~/types';
import { QueryError } from '~/errors';
import { parallel } from 'promist';
import entry, { IResolveEntryArgs } from '../entry';
import resolveEdge from './edge';

export interface IResolveQueryOpts<T extends Collection> {
  query?: IJqlQuery<T>;
  by?: { key: keyof T; values: any[] };
}

export default async function resolveQuery<T extends Collection>(
  args: IResolveEntryArgs<T>,
  opts?: IResolveQueryOpts<T>
): Promise<TQueryResponse<T>> {
  return entry(args, opts, (args, opts) => trunk(args, opts));
}

export async function trunk<T extends Collection>(
  args: Required<IResolveEntryArgs<T>>,
  opts: IResolveQueryOpts<T>
): Promise<TQueryResponse<T>> {
  const { collection, path, context } = args;
  const { query } = opts;

  const empty = () => ({ collection, info, items: [] });
  let q: IJqlBasicQuery<T> | undefined;
  if (query) {
    q = { where: query.where, paginate: query.paginate };
    if (query.paginate) {
      if (query.paginate.limit != undefined) {
        q.paginate = Object.assign({}, query.paginate, {
          limit: query.paginate.limit + 1
        });
      }
    }
  }

  const pathStr = path.join('.');
  const items = await context.query({
    id: pathStr,
    collection,
    query,
    by: opts.by
  });
  if (!items) throw new QueryError('ResponseError');

  const info = {
    previous: Boolean(query && query.paginate && query.paginate.skip),
    next: false
  };
  if (!items.length) return empty();
  if (q && q.paginate && q.paginate.limit) {
    info.next = items.length === q.paginate.limit;
    items.pop();
  }
  if (!items.length) return empty();

  const edgesKeys =
    query && query.edges
      ? Object.keys(query.edges).filter((key) =>
          Boolean((query.edges as any)[key])
        )
      : [];

  return {
    collection,
    info,
    items: edgesKeys.length
      ? await parallel.map(items, async (item) => {
          const edgesPromises = edgesKeys.map((key) => {
            return resolveEdge(
              { collection, item, edge: key, context, path: path.concat(key) },
              { query: query && (query.edges as any)[key] }
            );
          });
          return {
            data: item,
            edges: await Promise.all(edgesPromises).then((edgesArr) => {
              const edges: IOfType<TQueryResponse<any>> = {};
              for (let i = 0; i < edgesArr.length; i++) {
                edges[edgesKeys[i]] = edgesArr[i];
              }
              return edges;
            })
          };
        })
      : items.map((item) => ({ data: item }))
  };
}
