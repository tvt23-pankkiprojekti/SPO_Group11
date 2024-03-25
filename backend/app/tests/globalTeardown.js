const server = require('../src/server.js');
const {pool} = require('../src/database.js');

module.exports = async () => {
    server.close();
    pool.end();
};
