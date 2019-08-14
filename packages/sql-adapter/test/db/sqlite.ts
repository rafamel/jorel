import path from 'path';
import Knex from 'knex';

const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: path.join(__dirname, 'db.sqlite')
  },
  migrations: {
    directory: path.join(__dirname, 'migrations')
  }
});

export default knex;
