const router = require('express').Router();
const {pool} = require('../database.js');

router.get('/', async(req, res)=>{
    const accNum = req.body.accountNumber;
    let data1;
    let data2;

    data1 = (await pool.query('SELECT `balance` FROM `Account` WHERE `accountNumber`=?',[accNum]));
    data2 = (await pool.query('CALL getAllAccountTransactions(?)',[accNum]));
    data2 = data2[0][0];

    const slicedData = data2.slice(0,5);

    res.status(200);
    res.json({balance: data1[0][0], recenttransactions: slicedData});
  });
  
  module.exports = router;