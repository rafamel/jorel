import { Collection } from '../../src';
import sqlAdapter from '@jorel/sql-adapter';
import { JSONSchema7 } from 'json-schema';
import db from './connection';

afterAll(async () => {
  await db.destroy();
});

const adapter = sqlAdapter(db);

class Region extends Collection {}
class Store extends Collection {}
class Order extends Collection {}
class Post extends Collection {}

class User extends Collection {
  public static adapter = adapter;
  public static collection = 'users';
  public static id = 'id';
  // TODO
  public static edges: any = {
    one: {
      favorite: [{ from: 'favorite_id', to: 'id', at: Store }],
      region: [
        {
          index: { from: 'store_id', to: '' },
          where: {},
          match: {
            id: { $eq: 'store_id' },
            rating: { $gte: 'min_rating' }
          },
          at: Store
        },
        { from: 'region_id', to: 'id', at: Region }
      ]
    },
    many: {
      posts: [{ from: 'id', to: 'id', at: Post }],
      boughtAt: [
        { from: 'id', to: 'user_id', at: Order },
        { from: 'store_id', to: 'id', at: Store }
      ]
    }
  };
  public static schema: JSONSchema7 = {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string' }
    }
  };
}

export default function createCollection(): typeof User {
  return class extends User {};
}
