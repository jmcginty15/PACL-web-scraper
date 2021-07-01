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
            const sponsorQuery = 'INSERT INTO clubs (id, type, name) VALUES (@id, @type, @name)';
            sponsorParams.push({ name: 'type', type: TYPES.Text, value: sponsoringClub.slice(0, 1) });
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

    static async getById(id) {
        const eventQuery = 'SELECT * FROM events WHERE id = @id';
        const eventParams = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const eventRes = await executeSql(eventQuery, eventParams, 'SELECT');

        let event = null;
        if (eventRes.length === 0) return event;
        else event = eventRes[0];

        event.id = parseInt(event.id);
        event.sponsoringClub = await Event.getSponsoringClub(event.sponsoringClub);
        event.chiefTd = await Event.getChiefTd(event.chiefTd);
        event.sections = await Event.getSections(event.id);
        event.entries = await Event.getEntries(event.id);

        return event;
    }

    static async getSponsoringClub(id) {
        const query = 'SELECT * FROM clubs WHERE id = @id';
        const params = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const sponsorRes = await executeSql(query, params, 'SELECT');
        const sponsor = sponsorRes[0];
        sponsor.id = `${sponsor.type}${sponsor.id}`;
        delete sponsor.type;
        return sponsor;
    }

    static async getChiefTd(id) {
        const query = 'SELECT * FROM members WHERE id = @id';
        const params = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const chiefTdRes = await executeSql(query, params, 'SELECT');
        const chiefTd = chiefTdRes[0];
        chiefTd.id = parseInt(chiefTd.id);
        if (chiefTd.FIDEID) chiefTd.FIDEID = parseInt(chiefTd.FIDEID);
        return chiefTd;
    }

    static async getSections(id) {
        const query = 'SELECT id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl FROM sections WHERE event = @event ORDER BY id';
        const params = [{ name: 'event', type: TYPES.BigInt, value: parseInt(id) }];
        const sections = await executeSql(query, params, 'SELECT');
        for (let section of sections) section.chiefTd = parseInt(section.chiefTd);
        return sections;
    }

    static async getEntries(id) {
        const query = 'SELECT section, player, pairingNum, score, ratingBefore, ratingAfter, ratingDualBefore, ratingDualAfter FROM entries WHERE event = @event ORDER BY section, pairingNum';
        const params = [{ name: 'event', type: TYPES.BigInt, value: parseInt(id) }];
        const entries = await executeSql(query, params, 'SELECT');
        for (let entry of entries) entry.player = parseInt(entry.player);
        return entries;
    }

    async load() {
        const html = await getEventHtml(this.path);
        if (html === 'error') return html;
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