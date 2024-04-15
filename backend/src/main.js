const server = require('./server.js');
const { API } = require('./config.js');

server.listen(
    API.PORT,
    () => console.log(`Running at ${API.url()}`)
);
