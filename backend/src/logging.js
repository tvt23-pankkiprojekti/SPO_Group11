const rfs = require('rotating-file-stream');

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: 'log',
    teeToStdout: true
});

module.exports = accessLogStream;
