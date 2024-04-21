const jwt = require('jsonwebtoken');
const {API} = require('../config.js');
const Response = require('../responses.js');
const Administrator = require('../models/administratorModel.js');

async function adminAuth(req, res, next) {
    const token = req.get('Authorization');

    // no token -> bad request
    if (!token) {
        res.status(400);
        return res.json({code: Response.MISSING_PARAMETERS});
    }
    
    let login;

    try {
        ( {login} = jwt.verify(token, API.SECRET) );

        if (!login) {
            // Signed data was valid, but it wasn't an admin token.
            // For example someone tried to query admin routes with a card token.
            throw new Error();
        }
    }
    catch (error) {
        res.status(403);
        return res.json({code: Response.INVALID_TOKEN});
    }

    req.admin = login;
    next();
}

module.exports = adminAuth;
