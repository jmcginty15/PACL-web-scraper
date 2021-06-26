const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');

class Entry {
    static async insertIfNotExists({ event, section, player, pairingNum, score, ratingBefore, ratingAfter, ratingDualBefore, ratingDualAfter }) {
        const entryCheckQuery = 'SELECT * FROM entries WHERE event = @event AND section = @section AND player = @player';
        const entryCheckParams = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'section', type: TYPES.Int, value: parseInt(section) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(player) }
        ];
        const entryRes = await executeSql(entryCheckQuery, entryCheckParams, 'SELECT');

        if (entryRes.length === 0) {
            const query = 'INSERT INTO entries (event, section, player, pairingNum, score, ratingBefore, ratingAfter, ratingDualBefore, ratingDualAfter) VALUES (@event, @section, @player, @pairingNum, @score, @ratingBefore, @ratingAfter, @ratingDualBefore, @ratingDualAfter)';
            const params = [
                { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
                { name: 'section', type: TYPES.BigInt, value: parseInt(section) },
                { name: 'player', type: TYPES.BigInt, value: parseInt(player) },
                { name: 'pairingNum', type: TYPES.Int, value: parseInt(pairingNum) },
                { name: 'score', type: TYPES.Float, value: parseFloat(score) },
                { name: 'ratingBefore', type: TYPES.Text, value: ratingBefore },
                { name: 'ratingAfter', type: TYPES.Text, value: ratingAfter },
                { name: 'ratingDualBefore', type: TYPES.Text, value: ratingDualBefore },
                { name: 'ratingDualAfter', type: TYPES.Text, value: ratingDualAfter }
            ];

            let msg = `Entry ${event}.${section}.${player} inserted`;
            try {
                await executeSql(query, params, 'INSERT');
            } catch (err) {
                console.log(err);
                msg = `Entry ${event}.${section}.${player} already exists`;
            }
            console.log(msg);
        } else console.log(`Entry ${event}.${section}.${player} already exists`);
    }

    static async findById(event, section, player) {
        const entryCheckQuery = 'SELECT * FROM entries WHERE event = @event AND section = @section AND player = @player';
        const entryCheckParams = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'section', type: TYPES.Int, value: parseInt(section) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(player) }
        ];
        const entryRes = await executeSql(entryCheckQuery, entryCheckParams, 'SELECT');

        if (entryRes.length === 0) return null;
        else return entryRes[0];
    }
}

module.exports = { Entry };