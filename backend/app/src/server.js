const express = require('express');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

const userRouter = require('./routes/user.js');
const accountRouter = require('./routes/account.js');
const app = express();

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: '/log',
    teeToStdout: true
});

app.use(morgan(
    ':remote-addr - :method :url - :status [:user-agent]',
    {stream: accessLogStream}
));

app.use(express.json());
app.use('/user', userRouter);
app.use('/account', accountRouter);

const server = http.createServer(app);

module.exports = server;
