const router = require('express').Router();
const {pool} = require('../database.js');

router.get('/', async(req, res, next) => {
    let data;
    
    try {
        const accNum = req.body.accountNumber;
        data = (await pool.query('SELECT `balance`, `limit` FROM `Account` WHERE `accountNumber`=?',[accNum]))[0][0];
    }
    catch (e) {
        e.name = "DatabaseError";
        return next(e);
    }

    res.status(200);
    res.json({ balance: data });
  });
  
  module.exports = router;
