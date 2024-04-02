const router = require("express").Router();
const CardAccount = require("../models/cardAccountModel.js");

router.post("/", async (req, res) => {
    try {
        const { Card_id, Account_id } = req.body || {};

        const dbResult = (await CardAccount.insert(Card_id, Account_id))[0];

        res.status(201);
        res.send(dbResult.insertId);
    }
    catch (e) {
        res.status(500);
        res.json(e);
    }
});

router.get("/:id?", async (req, res) => {    
    try {
        const idCard_Account = req.params.id;
        let dbResult;
        
        if (idCard_Account) {
            dbResult = (await CardAccount.selectByCardAccountId(idCard_Account))[0];
        } else {
            dbResult = await CardAccount.selectAll();
        }
        
        if (dbResult.length === 0) {
            res.sendStatus(404);
            return;
        }

        res.json(dbResult[0]);
    }
    catch (e) {
        res.status(500);
        res.json(e);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const idCard_Account = req.params.id;
        const data = req.body;

        const dbResult = (await CardAccount.update(idCard_Account, data))[0];

        if (dbResult.affectedRows === 0) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(200);
    }
    catch (e) {
        res.status(500);
        res.json(e);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const idCard_Account = req.params.id;

        const dbResult = (await CardAccount.delete(idCard_Account))[0];

        if (dbResult.affectedRows === 0) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(200);
    }
    catch (e) {
        res.status(500);
        res.json(e);
    }
});

module.exports = router;
