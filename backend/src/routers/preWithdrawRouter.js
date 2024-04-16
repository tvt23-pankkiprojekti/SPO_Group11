const router = require('express').Router();
const {pool} = require('../database.js');

//generic error handler catches errors
router.get('/', async(req, res)=>{
  const accNum = req.body.accountNumber;
  let data;
  data = (await pool.query('CALL getGeneralInfo(?)',[accNum]));

  res.status(200);
  res.json(data[0][0][0]);
});

module.exports = router;