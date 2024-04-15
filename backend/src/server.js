const express = require('express');
const http = require('http');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

const accountRouter = require("./routers/crud/accountRouter.js");
const administratorRouter = require('./routers/crud/administratorRouter.js');
const friendRouter = require('./routers/crud/friendRouter.js');
const cardRouter = require("./routers/crud/cardRouter.js");
const cardAccountRouter = require("./routers/crud/cardAccountRouter.js");
const userRouter = require('./routers/crud/userRouter.js');
const transactionRouter = require('./routers/crud/transactionRouter.js');

const loginRouter = require('./routers/loginRouter.js');

const app = express();

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: 'log',
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
app.use("/api/account", accountRouter);
app.use('/api/user', userRouter);
app.use('/api/transaction', transactionRouter);

app.use("/api/login", loginRouter);

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
