// For some reason simply importing the SQL
// script generated by Workbench does not work.
// Which is why it has to be imported it with node.
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const server = require('./src/server.js');
const { API } = require('./src/config.js');
const { dbConfig } = require('./src/database.js');

(async () => {
    const sqlPath = path.join(__dirname, 'sql');

    const createTablesSql = fs.readFileSync(
        path.join(sqlPath, 'init.sql'),
        'utf8'
    );

    // Create a connection with insecure multiple statements enabled just
    // for creating the test database. This will not be used elsewhere.
    const connection = await mysql.createConnection({
        ...dbConfig,
        multipleStatements: true
    });

    await connection.query(createTablesSql);
    await connection.end();
})();
