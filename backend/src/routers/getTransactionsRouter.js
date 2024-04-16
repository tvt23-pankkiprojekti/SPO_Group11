const router = require("express").Router();
const { pool } = require('../database.js');

router.get('/', async (req, res, next) => {
    const { accountNumber } = req.body;

    let dbResult;

    try {
        dbResult = (await pool.query(
            'CALL getAllAccountTransactions(?)',
            [accountNumber]
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
