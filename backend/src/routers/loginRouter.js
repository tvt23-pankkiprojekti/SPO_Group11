const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../database.js");
const { API } = require("../config.js");
const Card = require("../models/cardModel.js");
const Response = require("../responses.js");

router.post("/:number", async (req, res, next) => {
    const body = req.body || {};

    // Pin validation is done on the frontend,
    // so we should NEVER fail here
    if (!body.pin) {
        res.status(400);
        res.json({ code: Response.MISSING_PARAMETERS });
        return;
    }

    // Try querying the database for card data,
    // if the query is empty, or if the card does not exist
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

    // Get account ID(s) and send them back
    try {
        const dbResult = (await pool.query("CALL getCardAccounts(?)", [idCard]))[0][0];

        if (dbResult.length === 0) {
            res.status(404);
            res.json({ code: Response.NO_ACCOUNT_LINKED });
            return;
        }
    
        const debit = dbResult.find(a => a.type === "debit");
        const credit = dbResult.find(a => a.type === "credit");
        const json = {
            ...(debit) && { "debit": jwt.sign({ accountNumber: debit }, API.SECRET, { expiresIn: 600 }) },
            ...(credit) && { "credit": jwt.sign({ accountNumber: credit }, API.SECRET, { expiresIn: 600 }) }
        };

        res.json(json);
    }
    catch (e) {
        e.name = "DatabaseError";
        e.code = Response.SERVER_ERROR;
        next(e);
        return;
    }
});

module.exports = router;
