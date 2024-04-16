const mysql = require('mysql2/promise');
const { DB } = require('./config.js');

const dbConfig = {
    host: DB.HOST,
    database: DB.NAME,
    user: DB.USER,
    password: DB.PASS,
    port: DB.PORT
};

const pool = mysql.createPool(dbConfig);

module.exports = {
    pool,
    dbConfig
};
