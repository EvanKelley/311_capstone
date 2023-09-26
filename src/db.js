const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = pool;