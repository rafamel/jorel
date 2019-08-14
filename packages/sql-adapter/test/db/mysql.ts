import path from 'path';
import Knex from 'knex';

const knex = Knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: '5725',
    user: 'root',
    password: 'test',
    database: 'db'
  },
  migrations: {
    directory: path.join(__dirname, 'migrations')
  }
});
export default knex;
