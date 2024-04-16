const router = require('express').Router();
const config = require('../config.js');
const Withdraw = require('../models/preWithdrawModel.js');
const authorization = require('../middleware/userAuth.js')
// rest api not finished yet, but use response.js for Response handling
// const Response = require("../responses.js");



router.post('/example', async(req, res, next)=>{
    authorization.userAuth();
    const accNum = req.body.accountNumber;
    let data;
    //console.log(accNum, "!!!!!!!!!!!!!!!!");
    try{
      data = await Withdraw.getGI(accNum);
    }
    catch(err){
      return res.json({ code: 4 });
    }

    //console.log(data[0][0][0]);
    //console.log('HEIHEIEHI!');
    //console.log(data[0]);
    res.json(data[0][0][0]);
    
    


  //data1 = await Withdraw.getCardInfo(10);
  //const accN = data1[0][0][0].accountNumber;// ex. 'b765bb75-f8b8-11ee-8d0d-74563c0a37f6';
  //console.log('account number: ' + `${accN}`);
/*
  //const token = jwt.sign({accountNumber : `${accN}`}, secretKey) //req.headers.authorization;
  const token = req.headers.authorization;
  console.log(req.headers.authorization);

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
*/
});


module.exports = router;