module.exports = {
  log: 'info',
  project: `jorel-sql-adapter-test`,
  tasks: {
    test: {
      services: ['postgres', 'mysql', 'mariadb'],
      cmd: 'nps private.test'.split(' '),
      exec: {
        postgres: 'psql -U postgres -c'.split(' ').concat('CREATE DATABASE db;')
      }
    }
  },
  compose: {
    version: '3.4',
    services: {
      postgres: {
        image: 'postgres:11-alpine',
        environment: { POSTGRES_PASSWORD: 'test' },
        ports: ['5724:5432']
      },
      mysql: {
        image: 'mysql:8',
        environment: {
          MYSQL_ROOT_PASSWORD: 'test',
          MYSQL_DATABASE: 'db'
        },
        ports: ['5725:3306'],
        command: 'mysqld --default-authentication-plugin=mysql_native_password'.split(
          ' '
        )
      },
      mariadb: {
        image: 'mariadb:10',
        environment: {
          MYSQL_ROOT_PASSWORD: 'test',
          MYSQL_DATABASE: 'db'
        },
        ports: ['5726:3306']
      }
    },
    networks: {},
    volumes: {}
  }
};
