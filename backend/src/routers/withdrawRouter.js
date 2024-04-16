const router = require('express').Router();
const { pool } = require('../database.js');
const Response = require('../responses.js');

router.post('/', async (req, res, next) => {
    const {amount, accountNumber} = req.body;

    // Request did not supply an amount -> bad request
    if ( !amount || typeof amount !== 'number' ) {
        res.status(400);
        return res.json({code: Response.MISSING_PARAMETERS});
    }

    const dbResult = (await pool.query(
        'CALL withdraw(?, ?)',
        [accountNumber, amount]
    ))[0][0];

    const { message } = dbResult[0];

    if (['LOW_DEBIT_MONEY', 'LOW_CREDIT_MONEY'].includes(message)) {
        res.status(400);
        return res.json({code: Response.INSUFFICIENT_FUNDS});
    }

    res.status(200);
    res.json({code: Response.OK, amount: Number(message)});
});

module.exports = router;
