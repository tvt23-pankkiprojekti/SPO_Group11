const express = require('express');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

const administratorRouter = require('./routers/administratorRouter.js');
const friendRouter = require('./routers/friendRouter.js');
const cardRouter = require("./routers/cardRouter.js");
const cardAccountRouter = require("./routers/cardAccountRouter.js");

const app = express();

const userRoutes = require('../routes/userRoutes.js');
app.use('/user', userRoutes);


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

app.use('/api/administrator', administratorRouter);
app.use('/api/friend', friendRouter);
app.use("/api/card", cardRouter);
app.use("/api/card_account", cardAccountRouter);

app.use('/api', async (err, req, res, next) => {
    if (err.name != 'DatabaseError') {
        return next(err);
    }

    res.status(400);
    res.json(err);
    res.end();
});

app.use(async (err, req, res, next) => {
    console.error(err);
    res.status(500)
    res.json({name: "InternalServerError"});
    res.end();
});

const server = http.createServer(app);

module.exports = server;
