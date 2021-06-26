const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');
const { Member } = require('./member');

class Event {
    static async insertIfNotExists(id, name, locationCity, locationZip, dates, sponsoringClub, sponsorName, chiefTd, tdName, sections, players) {
        let msg = `Event ${id} ${name} inserted`;

        const sponsorCheckQuery = 'SELECT * FROM clubs WHERE id = @id';
        const sponsorId = sponsoringClub === '' ? 0 : sponsoringClub.slice(1);
        const sponsorParams = [{ name: 'id', type: TYPES.BigInt, value: parseInt(sponsorId) }];
        const sponsorCheck = await executeSql(sponsorCheckQuery, sponsorParams, 'SELECT');

        if (sponsorCheck.length === 0) {
            const sponsorQuery = 'INSERT INTO clubs (id, name) VALUES (@id, @name)';
            sponsorParams.push({ name: 'name', type: TYPES.Text, value: sponsorName });
            await executeSql(sponsorQuery, sponsorParams, 'INSERT');
        }

        await Member.insertIfNotExists(chiefTd);

        const query = 'INSERT INTO events (id, name, locationCity, locationZip, dates, sponsoringClub, chiefTd, sections, players) VALUES (@id, @name, @locationCity, @locationZip, @dates, @sponsoringClub, @chiefTd, @sections, @players)';
        const params = [
            { name: 'id', type: TYPES.BigInt, value: parseInt(id) },
            { name: 'name', type: TYPES.Text, value: name },
            { name: 'locationCity', type: TYPES.Text, value: locationCity },
            { name: 'locationZip', type: TYPES.Text, value: locationZip },
            { name: 'dates', type: TYPES.Text, value: dates },
            { name: 'sponsoringClub', type: TYPES.BigInt, value: parseInt(sponsoringClub.slice(1)) },
            { name: 'chiefTd', type: TYPES.BigInt, value: parseInt(chiefTd) },
            { name: 'sections', type: TYPES.Int, value: parseInt(sections) },
            { name: 'players', type: TYPES.Int, value: parseInt(players) }
        ];

        try {
            await executeSql(query, params, 'INSERT');
        } catch (err) {
            msg = `Event ${id} ${name} already exists`;
        }

        console.log(msg);
    }

    static async findById(id) {
        const eventQuery = 'SELECT * FROM events WHERE id = @id';
        const eventParams = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const eventRes = await executeSql(eventQuery, eventParams, 'SELECT');
        // try {
        //     eventRes = await executeSql(eventQuery, eventParams, 'SELECT');
        // } catch (err) {
        //     console.log(err);
        // }
        // return eventRes ? eventRes[0] : null;
        return eventRes.length === 0 ? null : eventRes[0];
    }
}

module.exports = { Event };