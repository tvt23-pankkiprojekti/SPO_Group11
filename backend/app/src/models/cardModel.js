const { pool } = require("../database.js");

const Card = {
    insert: async (User_id, pinHash, number, frozen, failedPinAttempts) => {
        return await pool.query(`
            INSERT INTO Card (User_id, pinHash, number, frozen, failedPinAttempts)
            VALUES (?, ?, ?, ?, ?)`,
            [User_id, pinHash, number, frozen, failedPinAttempts]
        );
    },
    selectAll: async () => {
        return await pool.query(`
            SELECT * FROM Card`
        );
    },
    selectByCardId: async (idCard) => {
        return await pool.query(`
            SELECT * FROM Card
            WHERE idCard = ?`,
            [idCard]
        );
    },
    update: async (idCard, data) => {
        return await pool.query(`
            UPDATE Card
            SET ?
            WHERE idCard = ?`,
            [data, idCard]
        );
    },
    delete: async (idCard) => {
        return await pool.query(`
            DELETE FROM Card
            WHERE idCard = ?`,
            [idCard]
        );
    }
}

module.exports = Card;
