const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');
const { Member } = require('./member');

class Section {
    static async insertIfNotExists(event, sectionNum, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl) {
        let msg = `Section ${event}.${sectionNum} ${name} inserted`;

        if (!chiefTd) {
            const tdQuery = 'SELECT * FROM events WHERE id = @id';
            const tdParams = [{ name: 'id', type: TYPES.BigInt, value: parseInt(event) }];
            const tdRes = await executeSql(tdQuery, tdParams, 'SELECT');
            chiefTd = tdRes[0].chiefTd;
        } else await Member.insertIfNotExists(chiefTd);

        const query = 'INSERT INTO sections (event, id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl) VALUES (@event, @id, @name, @dates, @chiefTd, @rounds, @players, @kFactor, @ratingSys, @tournamentType, @timeControl)';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'id', type: TYPES.BigInt, value: parseInt(sectionNum) },
            { name: 'name', type: TYPES.Text, value: name },
            { name: 'dates', type: TYPES.Text, value: dates },
            { name: 'chiefTd', type: TYPES.BigInt, value: parseInt(chiefTd) },
            { name: 'rounds', type: TYPES.Int, value: parseInt(rounds) },
            { name: 'players', type: TYPES.Int, value: parseInt(players) },
            { name: 'kFactor', type: TYPES.Text, value: kFactor },
            { name: 'ratingSys', type: TYPES.Text, value: ratingSys },
            { name: 'tournamentType', type: TYPES.Text, value: tournamentType },
            { name: 'timeControl', type: TYPES.Text, value: timeControl }
        ];

        try {
            await executeSql(query, params, 'INSERT');
        } catch (err) {
            msg = `Section ${event}.${sectionNum} ${name} already exists`;
        }

        console.log(msg);
    }

    static async findById(eventId, sectionNum) {
        const sectionQuery = 'SELECT * FROM sections WHERE event = @event AND id = @id';
        const sectionParams = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(eventId) },
            { name: 'id', type: TYPES.Int, value: parseInt(sectionNum) }
        ];
        const sectionRes = await executeSql(sectionQuery, sectionParams, 'SELECT');
        return sectionRes.length === 0 ? null : sectionRes[0];
    }
}

module.exports = { Section };