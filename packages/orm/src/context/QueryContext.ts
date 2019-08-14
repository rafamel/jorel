import { Collection } from '~/collection';
import { IConstructor, IJqlBasicQuery } from '~/types';
import hash, { none } from './hash';
import { QueryError } from '~/errors';

export interface IQueryContextArgs<T> {
  id?: string;
  collection: IConstructor<T> & typeof Collection;
  query?: IJqlBasicQuery<T>;
  by?: { key: keyof T; values: any[] };
}

export default class QueryContext {
  public early: boolean;
  public err: null | QueryError;
  public constructor(early: boolean = true) {
    this.early = early;
    this.err = null;
  }
  public async query<T extends Collection>(
    args: IQueryContextArgs<T>
  ): Promise<T[]> {
    try {
      this.fail();
      const queryId = args.id || (args.query ? hash(args.query) : none);
      const byId = (args.by && args.by.key) || none;
    } catch (err) {
      throw new QueryError('QueryError', { err }).first;
    }
  }
  private fail(): void {
    if (!this.early || !this.err) return;
    throw new QueryError('EarlyFailError');
  }
}
