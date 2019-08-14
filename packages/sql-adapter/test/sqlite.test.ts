import path from 'path';
import fs from 'fs';
import { adapter as compliance } from '@jorel/compliance';
import adapter from '../src';
import db from './db/sqlite';

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
afterAll(async () => {
  await db.destroy();
  fs.unlinkSync(path.join(__dirname, 'db/db.sqlite'));
});

describe(`asumptions`, () => {
  test(`Client introspection`, () => {
    const client = (obj: any): string => obj._context.client.config.client;

    expect(client(db)).toBe('sqlite3');
  });
});

compliance(adapter(db));
