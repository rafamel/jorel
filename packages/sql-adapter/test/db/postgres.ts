import path from 'path';
import Knex from 'knex';

const knex = Knex({
  client: 'pg',
  connection: 'postgres://postgres:test@localhost:5724/db',
  migrations: {
    directory: path.join(__dirname, 'migrations')
  }
});
export default knex;
