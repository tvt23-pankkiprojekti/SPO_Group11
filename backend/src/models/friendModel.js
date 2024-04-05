const {pool} = require('../database.js');

const Friend = {
    getAll: async () => {
        return await pool.query('SELECT * FROM Friend');
    },

    getById: async (id) => {
        return await pool.query('SELECT * FROM Friend WHERE idFriend = ?', [id]);
    },

    add: async (friend) => {
        return await pool.query(
            'INSERT INTO Friend (Account_id, User_id) values (?, ?)', [friend.Account_id, friend.User_id]
        );
    },

    delete: async (id) => {
        return await pool.query('DELETE FROM Friend WHERE idFriend = ?', [id]);
    },

    update: async (id, friend) => {
        return await pool.query(
            'UPDATE Friend SET ? WHERE idFriend = ?', [friend, id]
        );
    }
};

module.exports = Friend;
