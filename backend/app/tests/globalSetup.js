const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const server = require('../src/server.js');
const config = require('../src/config.js');
const {dbConfig} = require('../src/database.js');

module.exports = async () => {
    const sqlPath = path.join(__dirname, '..', '..', 'docker');

    const createTablesSql = fs.readFileSync(
        path.join(sqlPath, 'init.sql'),
        'utf8'
    );

    const insertTestDataSql = fs.readFileSync(
        path.join(sqlPath, 'insertTestData.sql'),
        'utf8'
    );

    // Create a connection with insecure multiple statements enabled just
    // for creating the test database. This will not be used elsewhere.
    const connection = await mysql.createConnection({
        ...dbConfig,
        multipleStatements: true
    });

    await connection.query(createTablesSql);
    await connection.query(insertTestDataSql);
    await connection.end();

    server.listen(config.PORT);
}
