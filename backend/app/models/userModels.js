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
    addUser : async(newUser)=>{
        const dbResult = await pool.query('INSERT INTO User (firstName, lastName) VALUES(?,?)',[newUser.firstName, newUser.lastName]);
        return dbResult;
    },
    updateUser : async(id, updateUser)=>{
        const dbResult = await pool.query('UPDATE User SET ? WHERE idUser=?', [updateUser, id]);
        return dbResult;
    },
    deleteUser : async(id)=>{
        const dbResult = await pool.query('DELETE FROM User WHERE idUser=?',[id]);
        return dbResult;
    }
};

module.exports = user;