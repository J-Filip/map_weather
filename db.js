// DESC connecting postgres and node
const Pool = require('pg').Pool;
require('dotenv').config();

// enviromental variables
const pg_user = process.env.PG_USER;
const pg_password = process.env.PG_PASSWORD;
const pg_database = process.env.PG_DATABASE;
const pg_host = process.env.PG_HOST;
const pg_port = process.env.PG_PORT;
const pg_database_url = process.env.DATABASE__URL; // we get this from heroku addon -> config vars

// confiugurations
const developmentConfig = { 
    user : pg_user,
    password: pg_password,
    database: pg_database,
    host: pg_host,
    port: pg_port
};

const productionConfig = {
    connectionString:pg_database_url
}

// if in production, use production configuration, use else development configuration
const pool = new Pool( 
    process.env.NODE_ENV === 'production' ? 
    productionConfig : developmentConfig 
    // developmentConfig 
);

    module.exports  = pool;