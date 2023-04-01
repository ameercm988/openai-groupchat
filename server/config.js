require('dotenv').config();

let config = {
  host: process.env.DOPAMINE_DB_HOST,
  user: process.env.DOPAMINE_DB_USER,
  password: process.env.DOPAMINE_DB_PASS,
  database: process.env.DOPAMINE_DB_NAME
}

module.exports = config;