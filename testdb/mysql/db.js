const mysql = require('mysql2/promise')
const config = require('../config')
const bluebird = require('bluebird')

module.exports = mysql.createConnection({
  user: config.connection.user,
  host: config.connection.host,
  password: config.connection.password,
  port: config.connection.port,
  Promise: bluebird
})