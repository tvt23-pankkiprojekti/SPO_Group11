const express = require('express');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

const app = express();

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: '../log',
    teeToStdout: true
});

app.use(morgan(
    ':remote-addr - :method :url - :status [:user-agent]',
    {stream: accessLogStream}
));

app.use(express.json());

app.use(async (err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.json({'error': 500});
});

const server = http.createServer(app);

module.exports = server;
