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

    static async findById(eventId, sectionNum) {
        const sectionQuery = 'SELECT * FROM sections WHERE event = @event AND id = @id';
        const sectionParams = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(eventId) },
            { name: 'id', type: TYPES.Int, value: parseInt(sectionNum) }
        ];
        const sectionRes = await executeSql(sectionQuery, sectionParams, 'SELECT');
        return sectionRes.length === 0 ? null : sectionRes[0];
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