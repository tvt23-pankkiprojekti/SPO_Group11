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

const userAuth = require('./middleware/userAuth.js');
const loginRouter = require('./routers/loginRouter.js');
const getTransactionsRouter = require('./routers/getTransactionsRouter.js');
const withdrawRouter = require('./routers/withdrawRouter.js');
const preWithdraw = require('./routers/preWithdrawRouter.js');

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

app.use('/admin/api/administrator', administratorRouter);
app.use('/admin/api/friend', friendRouter);
app.use("/admin/api/card", cardRouter);
app.use("/admin/api/card_account", cardAccountRouter);
app.use("/admin/api/account", accountRouter);
app.use('/admin/api/user', userRouter);
app.use('/admin/api/transaction', transactionRouter);

// Apply to any api route that is not login
app.use(/\/api\/(?!login).+/, userAuth);
app.use("/api/login", loginRouter);
app.use('/api/transactions', getTransactionsRouter);
app.use('/api/withdraw', withdrawRouter);
app.use('/api/prewithdraw', preWithdraw);

app.use('/admin/api', async (err, req, res, next) => {
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
