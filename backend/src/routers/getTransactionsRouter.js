const router = require("express").Router();
const { pool } = require('../database.js');

router.post('/', async (req, res, next) => {
    const { accountNumber, index, amount } = req.body;

    let dbResult;

    try {
        dbResult = (await pool.query(
            'CALL getTransactions(?, ?, ?)',
            [accountNumber, index, amount]
        ))[0][0];
    }
    catch (error) {
        error.name = 'DatabaseError';
        return next(error);
    }

    res.status(200);
    res.json(dbResult);
});

module.exports = router;
