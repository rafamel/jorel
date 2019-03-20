import Knex from 'knex';
import SqlAdapter from './SqlAdapter';

export async function returnSelectOne<T, S extends SqlAdapter<T>>(
  this: S,
  builder: Knex.QueryBuilder,
  select?: null | string[]
): Promise<Partial<T> | void> {
  if (select) {
    if (!select.length) {
      // No column is selected
      return builder.then(() => {});
    }

    // Some column are selected
    if (this.isPostgres) {
      return builder.returning(select).then((arr) => arr[0]);
    } else {
      const recordId = await builder.then((arr) => arr[0]);
      if (select.length === 1 && select[0] === this.id) {
        // Only id column is selected; we already have the id
        return { [this.id]: recordId } as any;
      }
      return this.builder()
        .select(select)
        .where(this.id, recordId)
        .then((arr) => arr[0]);
    }
  }

  // All columns are selected (select is undefined or null)
  if (this.isPostgres) return builder.returning('*').then((arr) => arr[0]);
  const recordId = await builder.then((arr) => arr[0]);
  return this.builder()
    .select()
    .where(this.id, recordId)
    .then((arr) => arr[0]);
}
