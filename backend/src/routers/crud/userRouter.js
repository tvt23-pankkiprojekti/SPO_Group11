const express=require('express');
const router=express.Router();
const User = require('../../models/userModel.js');

router.get('/:usernumber?', async(req, res, next)=>{
    const urlParamValue = req.params.usernumber; 
    let data;

    try{
        if (!urlParamValue){
            data = await User.getAllUsers();
        }
        else{
            data = (await User.getOneUser(urlParamValue))[0];
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
        data = await User.addUser(req.body);
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }
    
    res.json(data[0]);
});

router.put('/:usernumber', async(req, res, next)=>{
    const urlParamValue = req.params.usernumber;
    let data;

    try{
        data = await User.updateUser(urlParamValue, req.body);
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }

    res.json(data[0]);
});

router.delete('/:usernumber', async(req, res, next)=>{
    let data;

    try{
        data = await User.deleteUser(req.params.usernumber);
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }
    
    res.json(data[0]);
});

module.exports = router;
