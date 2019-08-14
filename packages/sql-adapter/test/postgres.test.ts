import { adapter as compliance } from '@jorel/compliance';
import adapter from '../src';
import db from './db/postgres';

beforeAll(() => db.migrate.latest());
afterAll(() => db.destroy());

describe(`asumptions`, () => {
  test(`Client introspection`, () => {
    const client = (obj: any): string => obj._context.client.config.client;

    expect(client(db)).toBe('pg');
  });
});

compliance(adapter(db));
