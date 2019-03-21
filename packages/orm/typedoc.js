const pkg = require('./package.json');
const path = require('path');

module.exports = {
  name: `${pkg.name} ${pkg.version}`,
  mode: 'file',
  module: 'system',
  theme: 'default',
  includeDeclarations: true,
  excludePrivate: true,
  excludeProtected: true,
  excludeExternals: true,
  excludePrivate: true,
  excludeNotExported: true,
  readme: path.join(__dirname, 'README.md'),
  exclude: [
    '**/internal/**/*.ts',
    '**/registry.ts',
    '**/validate.ts',
    '**/collections/constants.ts',
    '**/collections/initialize.ts'
  ]
};
