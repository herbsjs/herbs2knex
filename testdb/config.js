// Load .env files
const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) { throw result.error }

module.exports = {
    environment: 'testdb',
    database: {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    } 
  }