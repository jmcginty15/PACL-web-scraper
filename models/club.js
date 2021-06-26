const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');

class Club {
    static async insertIfNotExists(id, name) {
        let msg = `Club ${id} ${name} inserted`;

        const query = 'INSERT INTO clubs (id, name) VALUES (@id, @name)';
        const params = [
            { name: 'id', type: TYPES.BigInt, value: parseInt(id.slice(1)) },
            { name: 'name', type: TYPES.Text, value: name }
        ];

        try {
            await executeSql(query, params, 'INSERT');
        } catch (err) {
            msg = `Club ${id} ${name} already exists`;
        }

        console.log(msg);
    }
}

module.exports = { Club };