import db from './db/connection';
import { adapter as compliance } from '@jorel/compliance';
import adapter from '../src';

afterAll(async () => {
  await db.destroy();
});

describe(`asumptions`, () => {
  test(`Client introspection`, () => {
    // We need this in order to identify postgres
    expect(() => (db as any)._context.client.config.client).not.toThrow();
    expect((db as any)._context.client.config.client).toBe('sqlite3');
  });
});

// TODO test for postgres, mysql, mariadb
describe(`sqlite3`, () => {
  compliance(adapter(db));
});
