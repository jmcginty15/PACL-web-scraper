const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');
const { getEventHtml } = require('../scrapers/event_scraper');
const { parseEventFile } = require('../parsers/event_parser');

class Event {
    constructor(id) {
        this.id = id;
        this.path = `XtblMain.php?${id}`;
    }

    static async insertIfNotExists({ id, name, locationCity, locationZip, dates, sponsoringClub, sponsorName, chiefTd, tdName, sections, players }) {
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
        return eventRes.length === 0 ? null : eventRes[0];
    }

    async load() {
        const html = await getEventHtml(this.path);
        this.parseHtml(html);
    }

    parseHtml(html) {
        const event = parseEventFile(this.id, html);
        this.name = event.name;
        this.locationCity = event.locationCity;
        this.locationZip = event.locationZip;
        this.dates = event.dates;
        this.sponsorName = event.sponsorName;
        this.sponsoringClub = event.sponsoringClub;
        this.tdName = event.tdName;
        this.chiefTd = event.chiefTd;
        this.players = event.players;
        this.sections = event.sections;
    }
}

module.exports = { Event };