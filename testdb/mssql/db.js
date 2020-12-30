const  sql = require('mssql')
const config = require('../config')

module.exports =  new sql.ConnectionPool({
    user: config.connection.user,
    server: config.connection.host,
    database: 'master',
    password: config.connection.password,
  }).connect()
