const router = require("express").Router();
const Card = require("../models/cardModel.js");

router.post("/", async (req, res) => {
    try {
        const { User_id, pinHash, number, frozen, failedPinAttempts } = req.body || {};

        const dbResult = (await Card.insert(User_id, pinHash, number, frozen, failedPinAttempts))[0];

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
        const idCard = req.params.id;
        let dbResult;

        if (idCard) {
            dbResult = (await Card.selectByCardId(idCard))[0];
        } else {
            dbResult = await Card.selectAll();
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
        const idCard = req.params.id;
        const data = req.body;

        const dbResult = (await Card.update(idCard, data))[0];

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
        const idCard = req.params.id;

        const dbResult = (await Card.delete(idCard))[0];
        
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
