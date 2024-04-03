const express=require('express');
const router=express.Router();
const config = require('../config.js');
const transaction = require('../models/transactionModel.js');

router.get('/all', async(req,res)=>{
    const data = await transaction.getAllTransactions();
    res.json(data[0]);
});

router.get('/:transactionnumber', async(req,res)=>{
    const data = await transaction.getOneTransaction(req.params.transactionnumber);
    res.json(data[0]);
});

router.post('/', async(req,res)=>{
    const data = await transaction.addTransaction(req.body)
    res.json(data[0]);
});

router.put('/:transactionnumber', async(req,res)=>{
    const data = await transaction.updateTransaction(req.params.transactionnumber, req.body);
    res.json(data[0]);
});

router.delete('/:transactionnumber', async(req,res)=>{
    const data = await transaction.deleteTransaction(req.params.transactionnumber);
    res.json(data[0]);
});


module.exports = router;