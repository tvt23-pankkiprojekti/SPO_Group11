const server = require('../src/server.js');
const config = require('../src/config.js');

module.exports = async () => server.listen(config.PORT);
