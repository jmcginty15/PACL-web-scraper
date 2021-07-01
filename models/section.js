const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');
const { getSectionHtml } = require('../scrapers/section_scraper');
const { parseSectionFile } = require('../parsers/section_parser');

class Section {
    constructor(eventId, sectionNum) {
        this.event = eventId;
        this.id = sectionNum;
        this.path = `XtblMain.php?${eventId}.${sectionNum}`;
    }

    static async insertIfNotExists({ event, id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl }) {
        let msg = `Section ${event}.${id} ${name} inserted`;

        const query = 'INSERT INTO sections (event, id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl) VALUES (@event, @id, @name, @dates, @chiefTd, @rounds, @players, @kFactor, @ratingSys, @tournamentType, @timeControl)';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'id', type: TYPES.BigInt, value: parseInt(id) },
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
            msg = `Section ${event}.${id} ${name} already exists`;
        }

        console.log(msg);
    }

    static async getById(eventId, sectionNum) {
        const sectionQuery = 'SELECT * FROM sections WHERE event = @event AND id = @id';
        const sectionParams = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(eventId) },
            { name: 'id', type: TYPES.Int, value: parseInt(sectionNum) }
        ];
        const sectionRes = await executeSql(sectionQuery, sectionParams, 'SELECT');

        let section = null;
        if (sectionRes.length === 0) return section;
        else section = sectionRes[0];

        const event = section.event;

        section.event = await Section.getEvent(event);
        section.chiefTd = await Section.getChiefTd(section.chiefTd);
        section.entries = await Section.getEntries(event, section.id);

        return section;
    }

    static async getEvent(id) {
        const query = 'SELECT * FROM events WHERE id = @id';
        const params = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const eventRes = await executeSql(query, params, 'SELECT');
        const event = eventRes[0];
        event.id = parseInt(event.id);
        event.sponsoringClub = await Section.getEventSponsor(event.sponsoringClub);
        event.chiefTd = parseInt(event.chiefTd);
        return event;
    }

    static async getEventSponsor(id) {
        const query = 'SELECT * FROM clubs WHERE id = @id';
        const params = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const sponsorRes = await executeSql(query, params, 'SELECT');
        const sponsor = sponsorRes[0];
        return `${sponsor.type}${sponsor.id}`;
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

    static async getEntries(event, id) {
        const query = 'SELECT player, pairingNum, score, ratingBefore, ratingAfter, ratingDualBefore, ratingDualAfter FROM entries WHERE event = @event AND section = @section ORDER BY pairingNum';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'section', type: TYPES.BigInt, value: parseInt(id) }
        ];
        const entries = await executeSql(query, params, 'SELECT');
        for (let entry of entries) entry.player = parseInt(entry.player);
        return entries;
    }

    async load() {
        const html = await getSectionHtml(this.path);
        this.parseHtml(html);
    }

    parseHtml(html) {
        const section = parseSectionFile(this.event, this.id, html);
        this.name = section.name;
        this.chiefTd = section.chiefTd;
        this.dates = section.dates;
        this.rounds = section.rounds;
        this.players = section.players;
        this.kFactor = section.kFactor;
        this.ratingSys = section.ratingSys;
        this.tournamentType = section.tournamentType;
        this.timeControl = section.timeControl;
        this.entries = section.entries;
    }
}

module.exports = { Section };