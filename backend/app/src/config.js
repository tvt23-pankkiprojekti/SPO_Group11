const fs = require('fs');

module.exports = {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    SECRET: fs.readFileSync('/run/secrets/app_secret', 'utf8').trim()
}
