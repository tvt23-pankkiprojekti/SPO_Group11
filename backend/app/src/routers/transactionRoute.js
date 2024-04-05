const express=require('express');
const router=express.Router();
const config = require('../config.js');
const transaction = require('../models/transactionModel.js');

router.get('/:transactionnumber?', async(req, res, next)=>{
    const urlParamValue = req.params.transactionnumber;
    let data;
    
    try{
        if(!urlParamValue){
            data = await transaction.getAllTransactions();
        }
        else{
            data = (await transaction.getOneTransaction(urlParamValue))[0];
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
        data = await transaction.addTransaction(req.body);
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }
    
    res.json(data[0]);
});

router.put('/:transactionnumber', async(req, res, next)=>{
    const urlParamValue = req.params.transactionnumber;
    let data;

    try{
        data = await transaction.updateTransaction(urlParamValue, req.body);
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }
    
    res.json(data[0]);
});

router.delete('/:transactionnumber', async(req, res, next)=>{
    const urlParamValue = req.params.transactionnumber;
    let data;
    try{
        data = await transaction.deleteTransaction(urlParamValue);
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }
    
    res.json(data[0]);
});


module.exports = router;