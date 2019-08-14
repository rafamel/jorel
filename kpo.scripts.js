const { scripts } = require('./project.config');

module.exports.scripts = {
  ...scripts,
  bootstrap: ['lerna bootstrap', 'kpo build'],
  build: ['kpo @orm build', 'kpo @compliance build', 'kpo @sql-adapter build'],
  link: 'lerna link',

  /* Hooks */
  postinstall: 'kpo bootstrap'
};
