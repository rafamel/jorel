import Knex from 'knex';
import { TWhere } from '@jorel/orm';

export default function parseWhere<T>(
  builder: Knex.QueryBuilder,
  where?: TWhere<T>
): Knex.QueryBuilder {
  if (!where) return builder;

  const keys = Object.keys(where).filter((x) => x !== '$and' && x !== '$or');

  for (let column of keys) {
    const obj = (where as any)[column];
    const operators = Object.keys(obj);
    for (let operator of operators) {
      builder = queryEqualities(builder, operator, column, obj[operator]);
    }
  }

  if ((where as any).$and) {
    for (let and of (where as any).$and) {
      builder = builder.andWhere((x) => parseWhere(x, and));
    }
  }
  if ((where as any).$or) {
    for (let or of (where as any).$or) {
      builder = builder.orWhere((x) => parseWhere(x, or));
    }
  }
  return builder;
}

function queryEqualities(
  builder: Knex.QueryBuilder,
  operator: string,
  column: string,
  value: any
): Knex.QueryBuilder {
  switch (operator) {
    case '$eq':
      return builder.where(column, value);
    case '$ne':
      return builder.whereNot(column, value);
    case '$gte':
      return builder.where(column, '>=', value);
    case '$gt':
      return builder.where(column, '>', value);
    case '$lte':
      return builder.where(column, '<=', value);
    case '$lt':
      return builder.where(column, '<', value);
    case '$in':
      return builder.whereIn(column, value);
    case '$nin':
      return builder.whereNotIn(column, value);
    default:
      throw Error(`Bad query format`);
  }
}
