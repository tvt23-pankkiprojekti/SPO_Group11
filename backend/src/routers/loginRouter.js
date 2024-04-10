const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config.js");
const Card = require("../models/cardModel.js");
const CardAccount = require("../models/cardAccountModel.js");

// Status codes:
// 0    OK, just a 200 OK status might be sufficient here?
// 1    Card not found
// 2    Incorrect pin or no pin, should these be separate?
// 3    Card frozen
// 4    No account linked
// 5    No type provided
// 6    Invalid token
// 500  Server error

router.get("/verify/:number", async (req, res, next) => {
    const body = req.body || {};
    
    // Pin validation is done on the frontend,
    // so we should NEVER fail here
    if (!body.pin) {
        res.status(400);
        res.json({ code: 2 });
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
            res.json({ code: 1 });
            return;
        }

        idCard = dbResult[0].idCard;
        pinHash = dbResult[0].pinHash;
        frozen = dbResult[0].frozen;
    }
    catch (e) {
        e.name = "DatabaseError";
        e.code = 500;
        next(e);
        return;
    }

    // Check if card is frozen
    if (frozen) {
        res.status(403);
        res.json({ code: 3 });
        return;
    }

    // Check if pin matches
    console.log("PIN HASH:", pinHash);
    console.log("GIVEN PIN:", body.pin);

    const hashResult = bcrypt.compareSync(body.pin, pinHash);

    console.log("PIN MATCH:", hashResult);

    if (!hashResult) {
        res.status(401);
        res.json({ code: 2 });
        return;
    }

    // Get account id
    let accountIds;

    try {
        const dbResult = (await CardAccount.selectByCardId(idCard))[0];

        if (dbResult.length === 0) {
            res.status(404);
            res.json({ code: 4 });
            return;
        }

        accountIds = dbResult.map(row => row.Account_id);
    }
    catch (e) {
        e.name = "DatabaseError";
        e.code = 500;
        next(e);
        return;
    }

    console.log("ACCOUNT IDS:", accountIds);

    // If only one account is linked, type selection can be skipped,
    // and we can return the token immediately
    if (accountIds.length === 1) {
        const token = jwt.sign({ accountIds }, config.SECRET, { expiresIn: 600 }); // 10 minutes
        res.json({ code: 0, token, ask_type: false });
    }

    // If multiple accounts are linked
    else {
        const token = jwt.sign({ accountIds }, config.SECRET, { expiresIn: 30 }); // 30 seconds
        res.json({ code: 0, token, ask_type: true });
    }
});

module.exports = router;
