const sql = require('mssql')
const config = require('../config')

module.exports = new sql.ConnectionPool({
  server: config.connection.host,
  port: config.connection.port,
  user: config.connection.user,
  password: config.connection.password,
  database: 'master',
  options: {
    trustServerCertificate: true
  }
}).connect()
