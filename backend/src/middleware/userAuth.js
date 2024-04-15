const jwt = require('jsonwebtoken');
const {API} = require('../config.js');
const Response = require('../responses.js');

async function userAuth(req, res, next) {
    const token = req.get('Authorization');

    // no token -> bad request
    if (!token) {
        res.status(400);
        return res.json({code: Response.MISSING_PARAMETERS});
    }

    let accountNumber;

    try {
        ( {accountNumber} = jwt.verify(token, API.SECRET) );
    }
    catch (error) {
        res.status(403);
        return res.json({code: Response.INVALID_TOKEN});
    }

    req.body ||= {};
    req.body.accountNumber = accountNumber;
    next();
}

module.exports = userAuth;
