const TYPES = require('tedious').TYPES;
const { executeSql } = require('../db');
const { getEntryHtml } = require('../scrapers/entry_scraper');
const { parseEntryFile } = require('../parsers/entry_parser');
const { parseGames } = require('../parsers/game_parser');

class Entry {
    constructor(eventId, sectionNum, playerId) {
        let adjSectionNum = sectionNum;
        if (eventId === '201011288211' && parseInt(sectionNum) <= 4) `${parseInt(sectionNum) + 6}`;
        if (eventId === '200504307281' && parseInt(sectionNum) === 3) adjSectionNum = 4;
        this.event = eventId;
        this.section = sectionNum;
        this.player = playerId;
        let pathSection = `${adjSectionNum}`;
        while (pathSection.length < 3) pathSection = `0${pathSection}`;
        this.path = `XtblPlr.php?${eventId}-${pathSection}-${playerId}`;
    }

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

    static async getById(event, section, player) {
        const query = 'SELECT * FROM entries WHERE event = @event AND section = @section AND player = @player';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'section', type: TYPES.Int, value: parseInt(section) },
            { name: 'player', type: TYPES.BigInt, value: parseInt(player) }
        ];
        const entryRes = await executeSql(query, params, 'SELECT');

        let entry = null;
        if (entryRes.length === 0) return entry;
        else entry = entryRes[0];

        const eventId = entry.event;
        const sectionId = entry.section;
        const playerId = entry.player;

        entry.event = await Entry.getEvent(eventId);
        entry.section = await Entry.getSection(eventId, sectionId);
        entry.player = await Entry.getPlayer(playerId);

        return entry;
    }

    static async getEvent(id) {
        const query = 'SELECT * FROM events WHERE id = @id';
        const params = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const eventRes = await executeSql(query, params, 'SELECT');
        const event = eventRes[0];
        event.id = parseInt(event.id);
        event.sponsoringClub = await Entry.getEventSponsor(event.sponsoringClub);
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

    static async getSection(event, id) {
        const query = 'SELECT id, name, dates, chiefTd, rounds, players, kFactor, ratingSys, tournamentType, timeControl FROM sections WHERE event = @event AND id = @id';
        const params = [
            { name: 'event', type: TYPES.BigInt, value: parseInt(event) },
            { name: 'id', type: TYPES.BigInt, value: parseInt(id) }
        ];
        const sectionRes = await executeSql(query, params, 'SELECT');
        const section = sectionRes[0];
        section.chiefTd = parseInt(section.chiefTd);
        return section;
    }

    static async getPlayer(id) {
        const query = 'SELECT * FROM members WHERE id = @id';
        const params = [{ name: 'id', type: TYPES.BigInt, value: parseInt(id) }];
        const playerRes = await executeSql(query, params, 'SELECT');
        const player = playerRes[0];
        player.id = parseInt(player.id);
        if (player.FIDEID) player.FIDEID = parseInt(player.FIDEID);
        return player;
    }

    async load() {
        const html = await getEntryHtml(this.path, this.event, this.section);
        this.parseHtml(html);
        this.parseGames(html);
    }

    parseHtml(html) {
        const entry = parseEntryFile(this.event, this.section, this.player, html);
        this.ratingBefore = entry.ratingBefore;
        this.ratingAfter = entry.ratingAfter;
        this.ratingDualBefore = entry.ratingDualBefore;
        this.ratingDualAfter = entry.ratingDualAfter;
        this.score = entry.score;
        this.pairingNum = entry.pairingNum;
    }

    parseGames(html) {
        this.games = parseGames(this.event, this.section, this.player, html);
    }
}

module.exports = { Entry };