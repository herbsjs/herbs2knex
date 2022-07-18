// Load .env files
const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) { throw result.error }

module.exports = {
    client: process.env.DB_CLIENT,
    useNullAsDefault:true,
    connection: {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT),
      filename: process.env.DB_FILENAME
    } 
  }