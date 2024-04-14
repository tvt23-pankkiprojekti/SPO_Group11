const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../config.js');
const Withdraw = require('../models/preWithdrawModel.js');
// rest api not finished yet, but use response.js for Response handling
// const Response = require("../responses.js");

const secretKey = 'secret';

router.get('/example', async(req, res, next)=>{
  data1 = await Withdraw.getCardInfo(10);
  //console.log(data1[0][0][0].accountNumber);
  const accN = data1[0][0][0].accountNumber;// ex. 'b765bb75-f8b8-11ee-8d0d-74563c0a37f6';
  console.log('account number: ' + `${accN}`);
  //const token = jwt.sign({accountNumber : `${accN}`}, secretKey) //req.headers.authorization;
  const token = req.headers.authorization;
  console.log(req.headers.authorization);
  //console.log('Generated Token:', token);

  if(!token){
    return res.status(401).json({ code: 5 }); // Missing parameters (no pin, or type and token)
  }
  jwt.verify(token.split(' ')[1], secretKey, async (err, decoded) => { 
    try {
        const accountNumber = decoded.accountNumber;
        const data = await Withdraw.getGI(`${accountNumber}`);
        res.json(data[0][0][0]);
    } catch (err) {
        return res.json({ code: 4 }); // shouldn't this be 6 ? -> Response.INVALID_TOKEN
    }
});
  /*
  jwt.verify(token, secretKey, async(err, decoded) =>{
    try{
      const accountNumber = decoded.accountNumber;
      console.log(accountNumber, "!!!!!");
      const data = await Withdraw.getGI(`${accountNumber}`);
      res.json(data);
    }
    catch(err){
      return res.json({code: 4}); //Response.NO_ACCOUNT_LINKED
    }


     if(err){
      return res.json({ code: 4});
    }
    else{
      data = await Withdraw.getGI(`${accN}`);
      res.json(data[0][0][0]);
    } 
  });
  */
});


module.exports = router;