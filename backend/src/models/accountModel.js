const {pool} = require('../database.js');

const Account = {
    
    insert: async(account) => {
        return await pool.query('INSERT INTO Account (User_id, type, balance, `limit`, accountNumber) VALUES (?, ?, ?, ?, ?)',[account.user_id, account.type, account.balance, account.limit, account.accountNumber])
    },

    getAll: async() => {
        return await pool.query('SELECT * FROM Account');

    },

    getById: async(id) => {
        return await pool.query('SELECT * FROM Account WHERE idAccount = ?', [id]);
    },

    selectIdByIdsAndType: async (ids, type) => {
        return await pool.query(`
            SELECT idAccount FROM Account
            WHERE idAccount IN (?) AND type = ?`,
            [ids, type]
        );
    },

    update: async (id, account) => {
        return await pool.query('UPDATE Account SET ? WHERE idAccount = ?', [account, id]);
    },

    delete: async (id) => {
        return await pool.query('DELETE FROM Account WHERE idAccount = ?', [id]);
    }
};
module.exports = Account;