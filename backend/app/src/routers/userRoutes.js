const express=require('express');
const router=express.Router();
const config = require('../config.js');
const user = require('../models/userModels.js');

router.get('/:usernumber?', async(req, res, next)=>{
    const urlParamValue = req.params.usernumber; 
    let data;

    try{
        if (!urlParamValue){
            data = await user.getAllUsers();
        }
        else{
            data = (await user.getOneUser(urlParamValue))[0];
        }
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }

    res.json(data[0]);
});

router.post('/', async(req, res, next)=>{
    let data;

    try{
        data = await user.addUser(req.body);
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }
    
    res.json(data[0]);
});

router.put('/:usernumber', async(req, res, next)=>{
    const urlParamValue = req.params.transactionnumber;
    let data;
    
    try{
        data = await user.updateUser(urlParamValue, req.body);
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }

    res.json(data[0]);
});

router.delete('/:usernumber', async(req, res, next)=>{
    const urlParamValue = req.params.transactionnumber;
    let data;

    try{
        data = await user.deleteUser(req.params.usernumber);
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }
    
    res.json(data[0]);
});

module.exports = router;