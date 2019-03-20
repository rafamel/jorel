import Knex from 'knex';
import SqlAdapter from './SqlAdapter';

export type TSqlAdapter<T> = (collection: string, id: string) => SqlAdapter<T>;
export default function sqlAdapter<T>(
  knex: Knex,
  maxBatch: number = 2500
): TSqlAdapter<T> {
  return (collection: string, id: string) =>
    new SqlAdapter(knex, collection, id, maxBatch);
}
