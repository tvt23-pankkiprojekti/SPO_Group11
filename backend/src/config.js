const process = require('process');
const fs = require('fs');
require('dotenv').config()

// Example .env for running locally:
// DB_HOST=localhost
// DB_NAME=mydb
// DB_USER=root
// DB_PASS=root
// DB_PORT=3306

// API_PROT=http
// API_HOST=localhost
// API_PORT=8008
// SECRET=secret

module.exports = {
    DB: {
        HOST: process.env.DB_HOST,
        USER: process.env.DB_USER,
        PASS: (
            process.env.NODE_ENV === 'production' ?
                fs.readFileSync('/run/secrets/app_db_password', 'utf8').trim() :
                process.env.DB_PASS
        ),
        NAME: process.env.DB_NAME,
        PORT: process.env.DB_PORT
    },
    API: {
        PROT: process.env.API_PROT,
        HOST: process.env.API_HOST,
        PORT: process.env.API_PORT,
        SECRET: (
            process.env.NODE_ENV === 'production' ?
                fs.readFileSync('/run/secrets/app_secret', 'utf8').trim() :
                process.env.SECRET
        ),
        url: () => {
            return `${process.env.API_PROT}://${process.env.API_HOST}:${process.env.API_PORT}`;
        }
    }
};
