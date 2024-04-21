const express = require('express');
const http = require('http');
const morgan = require('morgan');
const Response = require('./responses.js');
const accessLogStream = require('./logging.js');

const {logError, adminError, userError} = require('./middleware/errorHandling.js');

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
const balance = require('./routers/balanceRouter.js');

const app = express();

app.use(express.json());
app.use(morgan('combined', {stream: accessLogStream}));

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
app.use('/api/balance', balance);

app.use(logError);
app.use('/admin', adminError);
app.use(userError);

const server = http.createServer(app);

module.exports = server;
