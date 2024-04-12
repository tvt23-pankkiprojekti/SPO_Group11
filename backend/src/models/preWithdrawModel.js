const {pool} = require('../database.js');

const Withdraw = {
    getGI: async(accnumb)=>{
        const dbResult = await pool.query('CALL getGeneralInfo(?)',[accnumb]);
        return dbResult;
    },
    getCardInfo: async(cardId)=>{
        const dbResult = await pool.query('CALL getCardAccounts(?)',[cardId]);
        return dbResult;
    }
};

module.exports = Withdraw;