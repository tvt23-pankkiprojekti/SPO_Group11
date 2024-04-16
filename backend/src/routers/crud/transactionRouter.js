const express=require('express');
const router=express.Router();
const Transaction = require('../../models/transactionModel.js');

router.get('/:transactionnumber?', async(req, res, next)=>{
    const urlParamValue = req.params.transactionnumber;
    let data;
    
    try{
        if(!urlParamValue){
            data = await Transaction.getAllTransactions();
        }
        else{
            data = (await Transaction.getOneTransaction(urlParamValue))[0];
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
        data = await Transaction.addTransaction(req.body);
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
        data = await Transaction.updateTransaction(urlParamValue, req.body);
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
        data = await Transaction.deleteTransaction(urlParamValue);
    }
    catch(err){
        err.name = 'DatabaseError';
        return next(err);
    }
    
    res.json(data[0]);
});

module.exports = router;
