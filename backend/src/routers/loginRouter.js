const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { API } = require("../config.js");
const { pool } = require("../database.js");
const Card = require("../models/cardModel.js");
const CardAccount = require("../models/cardAccountModel.js");
const Response = require("../responses.js");

// Login example:
// 1) Make request to /api/login/with_card/<card number>, (e.g. 1000200030004000)
//    with a "pin" in the body

// 2) Receive a token in response, if only one account is linked
//    the token can be used with other requests. (valid for 10 minutes)

// 3) If multiple accounts are linked, partial token is returned, (valid for 1 minute)
//    and an additional request needs to be made to /api/login/with_type/<card number>,
//    with a "type" ("debit" or "credit") and "token" in the body, to get a "full" token

// Checking if a token is partial or full:
// * Full tokens contain only one account
// * Partial tokens contain two accounts

router.post("/with_card/:number", async (req, res, next) => {
    const body = req.body || {};
    
    // Pin validation is done on the frontend,
    // so we should NEVER fail here
    if (!body.pin) {
        res.status(400);
        res.json({ code: Response.MISSING_PARAMETERS });
        return;
    }

    // Try querying the database for card data,
    // if the query is empty, the card does not exist
    let idCard, pinHash, frozen;
    try {
        const number = req.params.number;
        const dbResult = (await Card.selectByCardNumber(number))[0];

        if (dbResult.length === 0) {
            res.status(404);
            res.json({ code: Response.CARD_NOT_FOUND });
            return;
        }

        idCard = dbResult[0].idCard;
        pinHash = dbResult[0].pinHash;
        frozen = dbResult[0].frozen;
    }
    catch (e) {
        e.name = "DatabaseError";
        e.code = Response.SERVER_ERROR;
        next(e);
        return;
    }

    // Check if card is frozen
    if (frozen) {
        res.status(403);
        res.json({ code: Response.CARD_FROZEN });
        return;
    }

    // Check if pin matches
    const hashResult = bcrypt.compareSync(body.pin, pinHash);
    if (!hashResult) {
        res.status(401);
        res.json({ code: Response.INCORRECT_PIN });
        return;
    }

    // Get account id
    let accountIds;
    try {
        const dbResult = (await CardAccount.selectByCardId(idCard))[0];

        if (dbResult.length === 0) {
            res.status(404);
            res.json({ code: Response.NO_ACCOUNT_LINKED });
            return;
        }

        accountIds = dbResult.map(row => row.Account_id);
    }
    catch (e) {
        e.name = "DatabaseError";
        e.code = Response.SERVER_ERROR;
        next(e);
        return;
    }

    // If only one account is linked, type selection can be skipped,
    // and we can return the token immediately
    if (accountIds.length === 1) {
        const token = jwt.sign({ accountIds }, API.SECRET, { expiresIn: 600 }); // 10 minutes
        res.json({ code: Response.OK, token });
    }

    // If multiple accounts are linked
    else {
        const token = jwt.sign({ accountIds }, API.SECRET, { expiresIn: 60 }); // 1 minute
        res.json({ code: Response.ASK_FOR_TYPE, token });
    }
});

router.post("/with_type/:number", async (req, res, next) => {
    const body = req.body || {};
    
    // Type validation is done on the frontend,
    // so we should NEVER fail here
    if (body.type !== "debit" && body.type !== "credit") {
        res.status(400);
        res.json({ code: Response.MISSING_PARAMETERS });
        return;
    }
    if (!body.token) {
        res.status(400);
        res.json({ code: Response.MISSING_PARAMETERS });
        return;
    }

    // Verify token
    let decoded;
    try {
        decoded = jwt.verify(body.token, API.SECRET);
    }
    catch (e) {
        res.status(403);
        res.json({ code: Response.INVALID_TOKEN });
        return;
    }

    if (!decoded.accountIds) {
        res.status(403);
        res.json({ code: Response.INVALID_TOKEN });
        return;
    }
    
    // Try getting account id of requested type
    let idAccount;
    try {
        const dbResult = (await pool.query(`
            SELECT idAccount FROM Account
            WHERE idAccount IN (?) AND type = ?`,
            [decoded.accountIds, body.type]
        ))[0];
        

        if (dbResult.length === 0) {
            res.status(404);
            res.json({ code: Response.NO_ACCOUNT_LINKED });
            return;
        }

        idAccount = dbResult[0].idAccount;
    }
    catch (e) {
        e.name = "DatabaseError";
        e.code = Response.SERVER_ERROR;
        next(e);
        return;
    }

    const token = jwt.sign({ idAccount }, API.SECRET, { expiresIn: 600 }); // 10 minutes
    res.json({ code: Response.OK, token });
});

module.exports = router;
