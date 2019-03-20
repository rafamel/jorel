import Knex from 'knex';
import knexConfig from './knexfile';
import path from 'path';

knexConfig.connection.filename = path.join(
  './test/db/',
  knexConfig.connection.filename
);
const knex = Knex(knexConfig);

export default knex;
