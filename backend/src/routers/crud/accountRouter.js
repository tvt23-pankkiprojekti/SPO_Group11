const router = require('express').Router();
const Account = require("../../models/accountModel.js");

router.post('/', async (req, res, next) => {

    const account = req.body;
    let dbResult;

    try{
        dbResult = await Account.insert(account);
    }
    catch (error) {
        error.name = 'DatabaseError';
        return next(error);
    }

    res.json(dbResult[0]);
});

router.get ('/:id?', async (req, res, next) =>{

    const requestedId = req.params.id;
    let dbResult;

    try {
        if (requestedId)
            dbResult = (await Account.getById(requestedId))[0];
        else    
            dbResult =  await Account.getAll();
    }
    catch (error){
        error.name = 'DatabaseError';
        return next(error);
    }

    res.json(dbResult[0]);
});

router.put('/:id', async (req, res, next) => {

    let dbResult;
    
    try{
        dbResult = await Account.update(req.params.id, req.body);
    }
    catch (error) {
        error.name = 'DatabaseError';
        return next(error);
    }

    res.json(dbResult[0]);
});

router.delete('/:id', async (req, res, next) => {
    
    const id = req.params.id;
    let dbResult;
    
    try {
        dbResult = await Account.delete(id);
    }
    catch (error) {
        error.name = 'DatabaseError';
        return next(error);
    }

    res.json(dbResult[0]);
});

module.exports = router;
