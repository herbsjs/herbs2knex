const { Pool } = require('pg')
const config = require('../config')

module.exports = new Pool({
  user: config.connection.user,
  host: config.connection.host,
  database: config.connection.database,
  password: config.connection.password,
  port: config.connection.port,
})