const {pool} = require('../src/database.js');

const transaction={
    getAllTransactions : async()=>{
        const dbResult = await pool.query('SELECT * FROM Transaction');
        return dbResult;
    },
    getOneTransaction : async(id)=>{
        const dbResult = await pool.query('SELECT * FROM Transaction where idTransaction=?',[id]);
        return dbResult;
    },
    addTransaction : async(newTransaction)=>{
        const dbResult = await pool.query('INSERT INTO Transaction (Card_id, Account_id, dateTime, balanceChange, transactionType) VALUES(?,?,?,?,?)',[newTransaction.Card_id, newTransaction.Account_id, newTransaction.dateTime, newTransaction.balanceChange, newTransaction.transactionType]);
        return dbResult;
    },
    updateTransaction : async(id, updateTransaction)=>{
        const dbResult = await pool.query('UPDATE Transaction SET ? WHERE idTransaction=?', [updateTransaction, id]);
        return dbResult;
    },
    deleteTransaction : async(id)=>{
        const dbResult = await pool.query('DELETE FROM Transaction WHERE idTransaction=?',[id]);
        return dbResult;
    }
};

module.exports = transaction;