const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../config.js');
const Withdraw = require('../models/preWithdrawModel.js');

const secretKey = 'secret';

router.get('/example', async(req, res, next)=>{
  data1 = await Withdraw.getCardInfo(1);
  //console.log(data1[0][0][0].accountNumber);
  const accN = data1[0][0][0].accountNumber;//'b765bb75-f8b8-11ee-8d0d-74563c0a37f6';
  console.log('account number: ' + `${accN}`);
  const token = jwt.sign({accountNumber : `${accN}`}, secretKey) //req.headers.authorization;
  //const token = req.headers.authorization;
  console.log(req.headers.authorization);
  //console.log('Generated Token:', token);

  if(!token){
    return res.status(401).json({ message: 'token missing' });
  }
  jwt.verify(token, secretKey, async(err) =>{
    if(err){
      return res.json({ code: 4});
    }
    else{
      data = await Withdraw.getGI(`${accN}`);
      //res.json({ message: 'token ok'});
      
      res.json(data[0][0][0]);
    } 
  });
});


module.exports = router;
/*
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token = null) return res.sendStatus(401);

    jwt.verify(token, config.SECRET, (err, user)=>{
        if (err) return res.sendStatus(403);
        req.user = user
        next();
    })
}
*/
// Sample secret key (replace this with your actual secret)
/*
// Middleware to verify the token
const verifyToken = (req, res, next) => {
const token = jwt.sign({accountNumber : 'f3cdbd26-f821-11ee-ba21-74563c0a37f6'}, secretKey) //req.headers.authorization;
console.log(req.headers.authorization);

if (!token) {
  return res.status(401).json({ message: 'Unauthorized: Missing token' });
}

jwt.verify(token, secretKey, (err, decoded) => {
  if (err) {
    res.send({ code: 4 });
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  // Token is valid, store the decoded data in the request for future use
  req.user = decoded;
  next();
});
};

// Sample route that requires token verification
router.get('/example', verifyToken, (req, res) => {
  // Access the decoded user data from the token
  const userData = req.user;
  res.json({ message: 'Token verified successfully!', userData });
});
*/
/*
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Sample secret key (replace this with your actual secret)
const secretKey = 'your_secret_key';

// Sample signed token received from the client
const signedToken = 'your_signed_token';

// Verify the token
jwt.verify(signedToken, secretKey, (err, decoded) => {
  if (err) {
    console.error('Token verification failed:', err.message);
    return;
  }

  console.log('Token verified successfully!');
  console.log('Decoded token:', decoded);
});
*/
/*
router.get('/:accnumb?', async(req, res, next) =>{
    
    console.log(await req.body.password);
});
*/
/*
const jwt = require('jsonwebtoken');

// Sample secret key (replace this with your actual secret)
const secretKey = 'your_secret_key';

// Sample signed token received from the client
const signedToken = 'your_signed_token';

// Verify the token
jwt.verify(signedToken, secretKey, (err, decoded) => {
  if (err) {
    console.error('Token verification failed:', err.message);
    return;
  }

  console.log('Token verified successfully!');
  console.log('Decoded token:', decoded);
});
*/
/*
router.get('/:usernumber?', async(req, res, next)=>{
    const urlParamValue = req.params.usernumber; 
    let data;

    try{
        if (!urlParamValue){
            data = await user.getAllUsers();
        }
        else{
            data = (await user.getOneUser(urlParamValue))[0];
        }
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }

    res.json(data[0]);
});
*/


/*
async function checkUser(username, password) {
    //... fetch user from a db etc.

    const match = await bcrypt.compare(password, user.passwordHash);

    if(match) {
        //login
    }

    //...
}
*/
