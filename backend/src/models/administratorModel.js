const {pool} = require('../database.js');

const Administrator = {
    getAll: async () => {
        return await pool.query('SELECT * FROM Administrator');
    },

    getById: async (id) => {
        return await pool.query('SELECT * FROM Administrator WHERE idAdministrator = ?', [id]);
    },

    getByLogin: async (login) => {
        return await pool.query('SELECT * FROM Administrator WHERE login = ?', [login]);
    },

    add: async (administrator) => {
        return await pool.query(
            'INSERT INTO Administrator (login, passwordHash) values (?, ?)', [administrator.login, administrator.passwordHash]
        );
    },

    delete: async (id) => {
        return await pool.query('DELETE FROM Administrator WHERE idAdministrator = ?', [id]);
    },

    update: async (id, administrator) => {
        return await pool.query(
            'UPDATE Administrator SET ? WHERE idAdministrator = ?', [administrator, id]
        );
    }
};

module.exports = Administrator;
