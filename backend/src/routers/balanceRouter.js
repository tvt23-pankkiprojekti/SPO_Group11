const router = require('express').Router();
const {pool} = require('../database.js');

router.get('/', async(req, res, next) => {
    let data;
    let data2;
    
    try {
        const accNum = req.body.accountNumber;
        data = (await pool.query('SELECT `balance`, `limit` FROM `Account` WHERE `accountNumber`=?',[accNum]))[0][0];
        data2 = (await pool.query("CALL getTransactions(?, 0, 5)", [accNum]))[0][0];
    }
    catch (e) {
        e.name = "DatabaseError";
        return next(e);
    }

    res.status(200);
    res.json({ balance: data, recenttransactions: data2 });
  });
  
  module.exports = router;
