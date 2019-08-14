import { Collection } from '~/collection';
import {
  TQueryResponse,
  TJqlQueryEdge,
  IJqlQuery,
  IRawItem,
  IJqlEdgeDefinition
} from '~/types';
import { QueryError } from '~/errors';
import { store } from '~/registry';
import resolveQuery from './query';
import entry, { IResolveEntryArgs } from '../entry';
import { QueryContext } from '~/context';

export interface IResolveEdgeArgs<T> extends IResolveEntryArgs<T> {
  item: Partial<T>;
  edge: string;
}

export default async function resolveEdge<T extends Collection>(
  args: IResolveEdgeArgs<T>,
  opts?: { query?: TJqlQueryEdge<any> }
): Promise<TQueryResponse<any>> {
  return entry(args, opts, async (args, opts) => {
    let { query } = opts;
    if (!query) {
      throw new QueryError('QueryError', {
        info: 'Unexpected falsy query on edge'
      });
    }
    if (typeof query === 'boolean') query = undefined;

    const { collection, edge: edgeName } = args;
    const edges = store.edges(collection.collection);
    let edge = edges[edgeName];
    if (!Array.isArray(edge)) edge = [edge];
    return trunk(args.item, edge, args.context, args.path, query);
  });
}

export async function trunk<T extends Collection>(
  item: Partial<T>,
  edge: Array<IJqlEdgeDefinition<T>>,
  context: QueryContext,
  path: string[],
  query?: IJqlQuery<any>
): Promise<TQueryResponse<any>> {
  let items: Array<IRawItem<any>> = [{ data: item }];

  const last = edge.pop();
  if (!last) {
    throw new QueryError('QueryError', { info: 'No edge query to run' });
  }

  for (let i = 0; i < edge.length; i++) {
    const def = edge[i];
    const res = await each(items, def, context, path.concat(String(i)));
    if (res.error) return res;
    items = res.items;
  }

  return each(items, last, context, path.concat(String(edge.length)), query);
}

export async function each<T extends Collection>(
  items: Array<IRawItem<any>>,
  def: IJqlEdgeDefinition<any>,
  context: QueryContext,
  path: string[],
  query?: IJqlQuery<any>
): Promise<TQueryResponse<T>> {
  if (!items.length) {
    return {
      collection: def.at,
      info: { previous: false, next: false },
      items: []
    };
  }

  let values: any[] = [];
  for (let item of items) {
    values.push(item.data[def.from]);
  }
  return resolveQuery(
    { collection: def.at, context, path },
    { query, by: { key: def.to, values } }
  );
}
