const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../database.js");
const { API } = require("../config.js");
const Administrator = require("../models/administratorModel.js");
const Response = require("../responses.js");

router.post('/', async (req, res, next) => {
    const body = req.body || {};
    const { login, password } = body;

    if (!login || !password) {
        res.status(400);
        res.json({ code: Response.MISSING_PARAMETERS });
        return;
    }

    const dbResult = (await Administrator.getByLogin(login))[0];

    if (dbResult.length === 0) {
        res.status(400);
        return res.json({code: 7});//Response.BAD_CREDENTIALS});
    }

    const hashResult = bcrypt.compareSync(password, dbResult[0].passwordHash);

    if (!hashResult) {
        res.status(401);
        return res.json({code: 7});//Response.BAD_CREDENTIALS});
    }

    res.status(200);
    res.json({token: jwt.sign({login}, API.SECRET, {expiresIn: 3600})});
});

module.exports = router;
