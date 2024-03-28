const {pool} = require('../src/database.js');

const user={
    getAllUsers : async()=>{
        const dbResult = await pool.query('SELECT * FROM User');
        return dbResult;
    },
    getOneUser : async(id)=>{
        const dbResult = await pool.query('SELECT * FROM User where idUser=?',[id]);
        return dbResult;
    },
    addUser : async(id, fname, lname)=>{
        const dbResult = await pool.query('INSERT INTO User VALUES(?,?)',[fname],[lname]);
        return dbResult;
    },
    updateUser : async(id, fname, lname)=>{
        const dbResult = await pool.query('UPDATE User SET firstName=?, lastName=? WHERE idUser=?',[fname], [lname], [id]);
        return dbResult;
    },
    deleteUser : async(id)=>{
        const dbResult = await pool.query('DELETE FROM User WHERE idUser=?',[id]);
        return dbResult;
    }
};

module.exports = user;