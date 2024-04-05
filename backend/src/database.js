const mysql = require('mysql2/promise');
const config = require('./config.js');

const dbConfig = {
    host: config.DB_HOST,
    database: config.DB_NAME,
    user: config.DB_USER,
    password: config.DB_PASSWORD
};

const pool = mysql.createPool(dbConfig);

module.exports = {
    pool,
    dbConfig
};
