const router = require('express').Router();
const Friend = require('../../models/friendModel.js');

router.get('/:id?', async (req, res, next) => {
    const requestedId = req.params.id;
    let dbResult;

    try {
        if (requestedId)
            [dbResult] = await Friend.getById(requestedId);
        else
            [dbResult] = await Friend.getAll();
    }
    catch (error) {
        error.name = 'DatabaseError';
        return next(error);
    }

    res.json(dbResult);
});

router.post('/', async (req, res, next) => {
    let dbResult;

    try {
        [dbResult] = await Friend.add(req.body);
    }
    catch (error) {
        error.name = 'DatabaseError';
        return next(error);
    }

    res.json(dbResult);
});

router.put('/:id', async (req, res, next) => {
    let dbResult;

    try {
        [dbResult] = await Friend.update(req.params.id, req.body);
    }
    catch (error) {
        error.name = 'DatabaseError';
        return next(error);
    }

    res.json(dbResult);
});

router.delete('/:id', async (req, res, next) => {
    let dbResult;

    try {
        [dbResult] = await Friend.delete(req.params.id);
    }
    catch (error) {
        error.name = 'DatabaseError';
        return next(error);
    }

    res.json(dbResult);
});

module.exports = router;
