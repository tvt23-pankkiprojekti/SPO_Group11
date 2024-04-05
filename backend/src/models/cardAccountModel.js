const { pool } = require("../database.js");

const CardAccount = {
    insert: async (Card_id, Account_id) => {
        return await pool.query(`
            INSERT INTO Card_Account (Card_id, Account_id)
            VALUES (?, ?)`,
            [Card_id, Account_id]
        );
    },
    selectAll: async () => {
        return await pool.query(`
            SELECT * FROM Card_Account`
        );
    },
    selectByCardAccountId: async (idCard_Account) => {
        return await pool.query(`
            SELECT * FROM Card_Account
            WHERE idCard_Account = ?`,
            [idCard_Account]
        );
    },
    update: async (idCard_Account, data) => {
        return await pool.query(`
            UPDATE Card_Account
            SET ?
            WHERE idCard_Account = ?`,
            [data, idCard_Account]
        );
    },
    delete: async (idCard_Account) => {
        return await pool.query(`
            DELETE FROM Card_Account
            WHERE idCard_Account = ?`,
            [idCard_Account]
        );
    }
}

module.exports = CardAccount;
