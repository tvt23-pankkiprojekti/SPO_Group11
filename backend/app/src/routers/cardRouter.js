const router = require("express").Router();
const bcrypt = require("bcrypt");
const Card = require("../models/cardModel.js");

router.post("/", async (req, res, next) => {
    try {
        const { User_id, number, frozen, failedPinAttempts } = req.body || {};
        const pinHash = req.body.pinHash
            ? await bcrypt.hash(req.body.pinHash, 10) 
            : undefined;

        const dbResult = (await Card.insert(User_id, pinHash, number, frozen, failedPinAttempts))[0];

        res.status(201);
        res.send(dbResult.insertId);
    }
    catch (e) {
        e.name = "DatabaseError";
        next(e);
    }
});

router.get("/:id?", async (req, res, next) => {
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
        e.name = "DatabaseError";
        next(e);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const idCard = req.params.id;
        let data = req.body;
        data.pinHash = data.pinHash
            ? await bcrypt.hash(data.pinHash, 10) 
            : undefined;

        const dbResult = (await Card.update(idCard, data))[0];

        if (dbResult.affectedRows === 0) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(200);
    }
    catch (e) {
        e.name = "DatabaseError";
        next(e);
    }
});

router.delete("/:id", async (req, res, next) => {
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
        e.name = "DatabaseError";
        next(e);
    }
});

module.exports = router;
