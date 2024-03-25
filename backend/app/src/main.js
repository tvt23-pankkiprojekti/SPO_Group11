const server = require('./server.js');
const config = require('./config.js');

server.listen(
    config.PORT,
    () => console.log(`Running at 127.0.0.1:${config.PORT}`)
);
