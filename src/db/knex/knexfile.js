require('dotenv').config({ path: '../../../.env' });
// require('dotenv').config({ path: `${process.env.PWD}/.env` });

const {
  db: {
    config: { knex },
  },
} = require('../../config');

module.exports = {
  development: knex,
  production: knex,
};
