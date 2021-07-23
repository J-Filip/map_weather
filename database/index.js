// DESC connecting postgres and node
const Pool = require('pg').Pool;
require('dotenv').config();

// enviromental variable
const password_DB = process.env.PASSWORD_DB;
const pool = new Pool({
    user : 'postgres',
    password: password_DB,
    database: 'mapweather_database',
    host: 'localhost',
    port: '5432'
});

module.exports  = pool;