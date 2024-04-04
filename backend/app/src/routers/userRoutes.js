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

/* router.get('/',function(request, response){
    user.getAllStudent(function(err, result){
        if(err){
            response.send(err);
        }
        else{
            console.log(result);
            response.json(result);
        }
    });
}); */
/* 
router.get('/users', async(req, res)=>{
    const dbResult = user.getAllUsers();
    res.send({data:'ghuor'});
    res.json(dbResult[0]);
/*     const requestedId = req.params.id;
    let dbResult;

    if (requestedId)
        dbResult = await user.getById(requestedId);
    else
        dbResult = await user.getAll();

    res.json(dbResult[0]); */
    //console.log("Hello");
    //const res = await fetch(`http://localhost:${config.PORT}/user`);
    
    //error handeler
/*     if(!res.ok){
        // throw:in jälkeistä koodia ei toteuteta
        throw new Error(err);
    } */
/*     const data = res.json();
    console.log(data); */

module.exports = router;